package main

import (
	"fmt"
	"net/http"
)

func main() {
	fmt.Println("Serving on https://localhost:8888")
	http.ListenAndServe(":8888", http.FileServer(http.Dir("_html")))
}
