package main

import (
	"YourPlace/src/core/middleware"
	"YourPlace/src/core/security"
	"YourPlace/src/routes"
	"embed"
	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/csrf"
	"html/template"
	"io/fs"
	"log"
	"net/http"
	"regexp"
	"strconv"
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

//go:embed src/www/image/favicon.ico
var favicon []byte

func main() {
	gin.SetMode(gin.DebugMode)
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
	routes.HomeRoutes(router, title)
	routes.AboutRoutes(router, title)
	routes.DownloadRoutes(router, title)
	// --- Start Web Server Loop --- //
	CSRF := csrf.Protect(cryptoSeed,
		csrf.SameSite(csrf.SameSiteStrictMode),
		csrf.Secure(true),
		csrf.HttpOnly(true),
		csrf.Path("/")) // github.com/gorilla/csrf
	// https://gin-gonic.com/docs/examples/graceful-restart-or-stop/
	var srv *http.Server
	srv = &http.Server{
		Addr:    ":" + strconv.Itoa(80),
		Handler: CSRF(router),
	}
	err := srv.ListenAndServe()
	if err != nil {
		log.Println("Could not start server: " + err.Error())
	}
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
