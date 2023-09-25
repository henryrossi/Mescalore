class Tokenizer:
    def __init__(self):
        self.Stemmer = PorterStemmer()

    def tokenize(self, slice):
        terms = []
        slice = slice.lower()
        while slice:
            if slice[0].isalpha():
                n = 1
                while len(slice) > n and (slice[n].isalpha() or slice[n] == "'"):
                    n += 1
                term = slice[:n]
                if len(term) > 2:
                    term = self.Stemmer.stem(term)
                    terms.append(term)
                slice = slice[n:]
            elif slice[0].isdigit():
                n = 1
                while len(slice) > n and slice[n].isdigit():
                    n += 1
                # Issue with . , / in numbers
                term = slice[:n]
                if len(term) > 2:
                    terms.append(term)
                slice = slice[n:]
            else:
                slice = slice[1:]
        return terms
    
class PorterStemmer:
    def __init__(self):
        self.vowels = ["a", "e", "i", "o", "u"]
        self.step2Suffixes = {
            "ational": "ate",
            "tional": "tion",
            "enci": "ence",
            "anci": "ance",
            "izer": "ize",
            "abli": "able",
            "alli": "al",
            "entli": "ent",
            "eli": "e",
            "ousli": "ous",
            "ization": "ize",
            "ation": "ate",
            "ator": "ate",
            "alism": "al",
            "iveness": "ive",
            "fulness": "ful",
            "ousness": "ous",
            "aliti": "al",
            "iviti": "ive",
            "biliti": "ble"
        }
        self.step3Suffixes = {
            "icate": "ic",
            "ative": "",
            "alize": "al",
            "iciti": "ic",
            "ical": "ic",
            "ful": "",
            "ness": ""
        }
        self.step4Suffixes = ['al', 'ance', 'ence', 'er', 'ic', 'able', \
            'ible', 'ant', 'ement', 'ment', 'ent', 'ou', 'ism', 'ate', 'iti', \
            'ous', 'ive', 'ize']

    def measure(self, word):
        vcSegments = 0
        lastChar = None
        for char in word:
            if char in self.vowels or (char == "y" and lastChar == "c"):
                lastChar = "o"
            else:
                if lastChar == "o":
                    vcSegments += 1
                lastChar = "c"
        return vcSegments

    def containsVowel(self, word):
        for char in word:
            if char in self.vowels or char == "y":
                return True
        return False
    
    def endsWithCVC(self, word):
        lenght = len(word)
        if lenght < 3:
            return False
        # important to note that I'm not counting y as a vowel here
        if (not word[lenght - 3] in self.vowels and 
            (word[lenght - 2] in self.vowels or word[lenght - 2] == "y") and
            not word[lenght - 1] in self.vowels and 
            not word[lenght - 1] in ["w", "x", "y"]):
            return True
        return False 
    
    def conditional1b(self, word):
        if word.endswith(("at", "bl", "iz")):
            word = word + "e"
        elif word[len(word) - 1] == word[len(word) - 2]:
            if not word.endswith(("l", "s", "z")) and not word[len(word) - 1] in self.vowels:
                word = word[:-1]
        elif self.measure(word) == 1 and self.endsWithCVC(word):
            word = word + "e"
        return word

    def stem(self, word):
        # word = word.lower()

        # Step 1a
        if word.endswith(("sses", "ies")):
           word = word[:-2]
        elif word.endswith("s") and not word.endswith("ss"):
            word = word[:-1]

        # Step 1b
        if word.endswith("eed"):
            if self.measure(word[:-1]) > 0:
                word = word[:-1]
        elif word.endswith("ed"):
            if self.containsVowel(word[:-2]):
                word = word[:-2]
                word = self.conditional1b(word)
        elif word.endswith("ing"):
            if self.containsVowel(word[:-3]):
                word = word[:-3]
                word = self.conditional1b(word)
        
        # Step 1c
        if word.endswith("y") and self.containsVowel(word[:-1]):
            word = word[:-1] + "i"

        # Step 2
        for suffix, replacement in self.step2Suffixes.items():
            if word.endswith(suffix):
                stem = word[:-len(suffix)]
                if self.measure(stem) > 0:
                    word = stem + replacement
                break
                # this break is only correct if the dictionary is 
                # checked in order
                # the only problem is ational must be check before tional
        
        # if a suffux is found in step two does that mean that 
        # there is no need to check for step 3 suffixes?
        # I don't think so
        # Chat gpt seems to think so
        
        # Step 3
        for suffix, replacement in self.step3Suffixes.items():
            if word.endswith(suffix):
                stem = word[:-len(suffix)]
                if self.measure(stem) > 0:
                    word = stem + replacement
                break
       
       
        # Step 4
        suffixFound = False
        for suffix in self.step4Suffixes:
            if word.endswith(suffix):
                stem = word[:-len(suffix)]
                if self.measure(stem) > 1:
                    word = stem
                suffixFound = True
                break
        if not suffixFound:
            if (word.endswith("tion") or word.endswith("sion")) and self.measure(word[:-3]) > 1:
                word = word[:-3]

        # Step 5a
        if word.endswith("e"):
            stem = word[:-1]
            measure = self.measure(stem)
            if measure > 1:
                word = stem
            elif measure == 1 and not self.endsWithCVC(stem):
                word = stem
        
        # Step 5b
        if word.endswith("ll") and self.measure(word) > 1:
            word = word[:-1]

        return word