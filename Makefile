#!make
.DEFAULT_GOAL := clean install build
EXECUTABLE := YourPlaceLanding

# --- OS Environment Setup --- #
ifeq ($(OS),Windows_NT)
DETECTED_OS=Windows_NT
HELPER=src\core\host\bin\helper\win-x64\$(EXECUTABLE)Helper.exe
PS=C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe
GO=C:\Program Files\Go\bin\go.exe
NODE=C:\Program Files\nodejs
CERTUTIL=C:\Windows\System32\certutil.exe
FINDSTR=C:\Windows\System32\findstr.exe
TASKKILL=C:\Windows\System32\taskkill.exe
RSRC=C:\Users\$(USERNAME)\go\bin\rsrc.exe
export PATH:=$(NODE);$(PATH)
else
DETECTED_OS=$(shell uname -s)
GO=$(shell which go)
NODE=$(shell which node)
endif

clean:
ifeq ($(DETECTED_OS),Windows_NT)
	@$(TASKKILL) /F /IM $(EXECUTABLE).exe >nul 2>&1 || exit 0
	IF EXIST target\ del /F /Q target\*
	$(GO) clean
else
	-pkill -f $(EXECUTABLE) 2>/dev/null || true
	rm -rf target/
	go clean
endif

install:
	npm install webpack webpack-cli ts-loader
	npm install package.json
	npm i baseline-browser-mapping@latest -D
	go get

build:
	npx webpack --config src/typescript/webpack.config.js
ifeq ($(DETECTED_OS),Windows_NT)
	$(GO) generate
	$(GO) build -ldflags="-s -w" -o target\$(EXECUTABLE).exe main.go
else
	go generate
	go build -o target/$(EXECUTABLE) main.go
endif

run:
ifeq ($(DETECTED_OS),Windows_NT)
	target/$(EXECUTABLE).exe
else
	./target/$(EXECUTABLE)
endif
