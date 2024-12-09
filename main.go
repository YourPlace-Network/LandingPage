package main

import (
	"YourPlace/src/core/middleware"
	"YourPlace/src/core/security"
	"YourPlace/src/routes"
	"crypto/tls"
	"crypto/x509"
	"database/sql"
	"embed"
	"encoding/pem"
	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
	_ "github.com/glebarez/go-sqlite"
	"github.com/gorilla/csrf"
	"html/template"
	"io/fs"
	"log"
	"net/http"
	"os"
	"regexp"
	"strings"
)

var (
	title      = "YourPlace"
	cryptoSeed = security.RandomBytes(32)
)

//go:embed src/templates
var templateFS embed.FS

//go:embed src/www
var wwwFS embed.FS

func main() {
	db, err := sql.Open("sqlite", "landingpage.sqlite.db")
	if err != nil {
		log.Fatalln("Could not connect to database: " + err.Error())
	}
	defer db.Close()
	err = db.Ping()
	if err != nil {
		log.Fatalln("Could not ping database: " + err.Error())
	}
	_, _ = db.Exec("CREATE TABLE IF NOT EXISTS subscribers (email TEXT PRIMARY KEY, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")

	if os.Getenv("GIN_MODE") == "debug" {
		gin.SetMode(gin.DebugMode)
	} else {
		gin.SetMode(gin.ReleaseMode)
	}
	router := gin.Default()
	LoadTemplates(router, templateFS, "src/templates/*tmpl")
	router.Use(middleware.ContentTypeMiddleware())
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.Use(gzip.Gzip(gzip.DefaultCompression))
	router.Use(security.Headers())
	router.StaticFS("/static", staticFS())
	router.StaticFile("/favicon.ico", "./src/www/image/favicon.ico")
	router.MaxMultipartMemory = 8 << 20
	routes.NotFoundRoutes(router, title)
	routes.HomeRoutes(router, title, db)
	routes.AboutRoutes(router, title)
	routes.DownloadRoutes(router, title)
	// --- Start Web Server Loop --- //
	CSRF := csrf.Protect(cryptoSeed, csrf.SameSite(csrf.SameSiteStrictMode),
		csrf.Secure(true), csrf.HttpOnly(true), csrf.Path("/"))
	var srv *http.Server
	if ifFileExists("cert.pem") && ifFileExists("cert.key") {
		cert, err := tls.LoadX509KeyPair("cert.pem", "cert.key")
		if err != nil {
			log.Fatalf("Failed to load certificate: %v", err)
		}
		tlsConfig := &tls.Config{
			Certificates: []tls.Certificate{cert},
			MinVersion:   tls.VersionTLS12,
		}
		srv = &http.Server{
			Addr:      ":443",
			Handler:   CSRF(router),
			TLSConfig: tlsConfig,
		}
		err = srv.ListenAndServeTLS("", "")
		if err != nil {
			log.Fatalln("Could not start server: " + err.Error())
		}
	} else {
		srv = &http.Server{
			Addr:    ":80",
			Handler: CSRF(router),
		}
		err = srv.ListenAndServe()
		if err != nil {
			log.Fatalln("Could not start server: " + err.Error())
		}
	}
}

func loadTLSConfig(certFile, keyFile string) (*tls.Config, error) {
	certPEMBlock, err := os.ReadFile(certFile)
	if err != nil {
		return nil, err
	}
	keyPEMBlock, err := os.ReadFile(keyFile)
	if err != nil {
		return nil, err
	}
	certDERBlock, _ := pem.Decode(certPEMBlock)
	if certDERBlock == nil {
		return nil, err
	}
	keyDERBlock, _ := pem.Decode(keyPEMBlock)
	if keyDERBlock == nil {
		return nil, err
	}
	privateKey, err := x509.ParsePKCS8PrivateKey(keyDERBlock.Bytes)
	if err != nil {
		privateKey, err = x509.ParsePKCS1PrivateKey(keyDERBlock.Bytes)
		if err != nil {
			privateKey, err = x509.ParseECPrivateKey(keyDERBlock.Bytes)
			if err != nil {
				return nil, err
			}
		}
	}
	tlsCert := tls.Certificate{
		Certificate: [][]byte{certDERBlock.Bytes},
		PrivateKey:  privateKey,
	}
	return &tls.Config{
		Certificates: []tls.Certificate{tlsCert},
		MinVersion:   tls.VersionTLS12,
	}, nil
}
func ifFileExists(file string) bool {
	_, err := os.Stat(file)
	if err != nil {
		if os.IsNotExist(err) {
			return false
		}
	}
	return true
}
func staticFS() http.FileSystem {
	// https://github.com/gin-contrib/static/issues/19#issuecomment-963604838
	sub, err := fs.Sub(wwwFS, "src/www")
	if err != nil {
		panic(err)
	}
	return http.FS(sub)
}
func LoadTemplates(engine *gin.Engine, embedFS embed.FS, pattern string) {
	// https://github.com/gin-gonic/gin/issues/2795
	root := template.New("")
	loadFunc := func(funcMap template.FuncMap, rootTemplate *template.Template, embedFS embed.FS, pattern string) error {
		pattern = strings.ReplaceAll(pattern, ".", "\\.")
		pattern = strings.ReplaceAll(pattern, "*", ".*")
		err := fs.WalkDir(embedFS, ".", func(path string, d fs.DirEntry, walkErr error) error {
			if walkErr != nil {
				return walkErr
			}
			if matched, _ := regexp.MatchString(pattern, path); !d.IsDir() && matched {
				data, readErr := embedFS.ReadFile(path)
				if readErr != nil {
					return readErr
				}
				t := root.New(path).Funcs(engine.FuncMap)
				if _, parseErr := t.Parse(string(data)); parseErr != nil {
					return parseErr
				}
			}
			return nil
		})
		return err
	}
	tmpl := template.Must(root, loadFunc(engine.FuncMap, root, embedFS, pattern))
	engine.SetHTMLTemplate(tmpl)
}
