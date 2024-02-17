import json
from langchain_core.documents import Document
import tiktoken

#Custom load function to load our json file into smaller documents
def loadJsonCustom_with_separators(jsonpath:str):
    with open(jsonpath, 'r',encoding='utf-8') as json_file:
        data = json.load(json_file)

    docs = []
    for d in data:
        for s in d['urlInfo']['sections']:
            docs.append(Document(page_content=s['section']+s['content'],metadata={'source':d['urlInfo']['url']}))

    return docs


def loadJsonCustom(jsonpath:str):
    with open(jsonpath, 'r',encoding='utf-8') as json_file:
        data = json.load(json_file)

    docs = []
    for d in data:
        docs.append(Document(page_content=d['content'],metadata={'source':d['url']}))

    return docs


#function to count tokens
def countTokens(query: str):
    encoding = tiktoken.get_encoding("cl100k_base")
    num_tokens=len(encoding.encode(query))
    return num_tokens
