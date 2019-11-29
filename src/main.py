#!flask/bin/python
from flask import Flask, jsonify, request, render_template, abort

from flask_cors import CORS
import text_utilities

app = Flask(__name__, template_folder="templates")
CORS(app)

@app.route('/analyze', methods=['POST'])
def analyze_corpora():
    if not request.json:
        abort(400)

    if "body" not in request.json.keys():
        abort(400)

    if "corpus_a" not in request.json["body"].keys():
        abort(400)

    if "corpus_b" not in request.json["body"].keys():
        abort(400)

    if "corpus_a_name" in request.json["body"].keys():
        corpus_a_name = request.json["body"]["corpus_a_name"]
    else:
        corpus_a_name = "Corpus A"

    if "corpus_b_name" in request.json["body"].keys():
        corpus_b_name = request.json["body"]["corpus_b_name"]
    else:
        corpus_b_name = "Corpus B"

    corpus_a = request.json["body"]["corpus_a"]
    corpus_b = request.json["body"]["corpus_b"]

    if "freq_clip" in request.json["body"].keys():
        freq_clip = request.json["body"]["freq_clip"]
    else:
        freq_clip = None

    if "filter_word" in request.json["body"].keys():
        filter_word = request.json["body"]["filter_word"]
        print(filter_word)
    else:
        print("NONE")
        filter_word = None

    total_num_words_a, unique_words_a, frequencies_a = text_utilities.get_metrics(corpus_a)
    total_num_words_b, unique_words_b, frequencies_b = text_utilities.get_metrics(corpus_b)
    vocab_a = set(unique_words_a)
    vocab_b = set(unique_words_b)
    add_to_b = vocab_a.difference(vocab_b)
    add_to_a = vocab_b.difference(vocab_a)

    for word in add_to_b:
        frequencies_b[word] = 0

    for word in add_to_a:
        frequencies_a[word] = 0

    total_frequencies = []
    total_vocab = vocab_b.union(vocab_a)

    for word in total_vocab:
        total_frequencies.append(
            {"word": word, "values": [{"value": frequencies_a[word], "corpus": corpus_a_name}, {"value": frequencies_b[word], "corpus": corpus_b_name}]})

    if filter_word != None:
        total_frequencies = [x for x in total_frequencies if filter_word in x["word"]]

    if freq_clip != None and freq_clip < len(total_frequencies):
        total_frequencies = total_frequencies[:freq_clip]

    total_frequencies = [x for x in sorted(total_frequencies, key=lambda x: max([d['value'] for d in x["values"]]), reverse=True)]

    response = {
        "body": {
            "total_num_words_a": total_num_words_a,
            "unique_words_a": unique_words_a,
            "total_num_words_b": total_num_words_b,
            "unique_words_b": unique_words_b,
            "frequencies": total_frequencies
        },
    }

    return jsonify(response), 201


if __name__ == '__main__':
    app.run(debug=True)

# TODO: Remove Stop Words
# TODO: Remove .,/[ And Other Signs
# TODO: Calculate Readibility Index Or Other Metrics
# TODO: Fix Sorting
