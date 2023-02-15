# https://gist.github.com/HaiyangXu/ec88cbdce3cdbac7b8d5
#Use to create local host

from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

PORT = 1337

def run(server_class=ThreadingHTTPServer, handler_class=SimpleHTTPRequestHandler):
    server_address = ('', PORT)
    httpd = server_class(server_address, handler_class)
    httpd.serve_forever()


if __name__ == "__main__":
    try:
        print("Server starting on http://localhost:1337/")
        run()
    except KeyboardInterrupt:
        exit(0)
