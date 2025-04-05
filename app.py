from flask import Flask, send_from_directory
import os
# TODO - add hot reload
app = Flask(__name__, static_folder="frontend/dist", static_url_path="")

@app.route("/")
@app.route("/dashboard")
def serve_react():
    return send_from_directory(app.static_folder, "index.html")


# Catch-all route for React Router (if you use it)
@app.route("/<path:path>")
def static_proxy(path):
    file_path = os.path.join(app.static_folder, path)
    if os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")