# Text utilities for calculations support.
import nltk
from collections import Counter

def get_word_list(text_block):
    return nltk.word_tokenize(text_block.lower())

def get_unique_words(word_list):
    return list(set(word_list))

def calc_word_freq(word_list):
    return Counter(word_list)

def get_metrics(text_block, freq_clip=None):

    word_list = get_word_list(text_block)

    total_num_words = len(word_list)
    unique_words = get_unique_words(word_list)
    frequencies = [{"word": x, "count":y} for x,y in sorted(calc_word_freq(word_list).items(), key=lambda x:x[1], reverse=True)]

    if freq_clip != None and freq_clip < len(frequencies):
        frequencies = frequencies[:freq_clip]

    elif freq_clip != None and freq_clip >= len(frequencies):
        frequencies = -1

    return total_num_words, unique_words, frequencies





if __name__ == "__main__":
    print(get_metrics("My question is, is there a more convenient way to do this for say up to phrases that are 4 or 5 in length without duplicating this code only to change the count variable?"))
