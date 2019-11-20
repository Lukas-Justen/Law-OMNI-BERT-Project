#!flask/bin/python
from flask import Flask, jsonify, request, render_template, abort
import text_utilities

app = Flask(__name__, template_folder="templates")

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/rest_handle', methods=['POST'])
def create_task():
    if not request.json:
        abort(400)

    return jsonify({'request': request.json}), 201


@app.route('/handle_form', methods=['POST'])
def handle_data():
    if not request.json:
        abort(400)

    if "body" not in request.json.keys():
        abort(400)

    if "text_blob" not in request.json["body"].keys():
        abort(400)

    text_blob = request.json["body"]["text_blob"]

    if "freq_clip" in request.json["body"].keys():
        freq_clip = request.json["body"]["freq_clip"]
    else:
        freq_clip = None

    total_num_words, unique_words, frequencies = text_utilities.get_metrics(text_blob, freq_clip=freq_clip)

    if frequencies == -1:
        abort(400, "freq_clip is out of range")

    response = {
                    "body": {
                                "total_num_words":total_num_words,
                                "unique_words":unique_words,
                                "frequencies":frequencies
                            },
                }

    return jsonify(response), 201


if __name__ == '__main__':
    app.run(debug=True)
