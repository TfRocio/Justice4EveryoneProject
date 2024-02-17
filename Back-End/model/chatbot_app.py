from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.memory import ChatMessageHistory
from langchain_community.vectorstores.faiss import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain.chains.combine_documents import create_stuff_documents_chain
from typing import Dict
from langchain_core.runnables import RunnablePassthrough
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from utils import countTokens
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableBranch
from langchain_community.callbacks import get_openai_callback

#Initialize model, history and embeddings
llm = ChatOpenAI()
demo_ephemeral_chat_history = ChatMessageHistory()
embeddings = OpenAIEmbeddings()

#Load documents
new_db = FAISS.load_local("./raw_data/vectorstore_with_separators", embeddings)
#Note that we don't split documents into chunks,
#there is a custom load function that already split the documents as we need it.

#Print number of documents loaded:
num_documents = len(new_db.index_to_docstore_id)
print(f"Total number of documents: {num_documents}")

 #Original prompt:
question_answering_prompt = ChatPromptTemplate.from_messages(
    [("system", "You are a virtual assistent named Pepe with an extense knowledge about the traffic regulations in Mexico City"),
      ("system", "Answer the user's questions based ONLY on the below context:\n\n{context}, if the context doesn't contain any relevant information to the question, don't try to make something up."),
        MessagesPlaceholder(variable_name="messages"),
        ("system", "Always answer to the user in spanish."),
        ])

def create_chatbot_response(user_input: str):
    # k is the number of chunks to retrieve
    retriever = new_db.as_retriever(search_kwargs={'k':3})

    #New prompt for query transformation:
    query_transform_prompt = ChatPromptTemplate.from_messages(
    [MessagesPlaceholder(variable_name="messages"),
        ("user",
        "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation. Only respond with the query, nothing else. Always generate the query in spanish",
        )])


    #Chain to use with query transofrmation:
    query_transforming_retriever_chain = RunnableBranch(
    (lambda x: len(x.get("messages", [])) == 1,
        # If only one message, then we just pass that message's content to retriever
    (lambda x: x["messages"][-1].content) | retriever),
        # If messages, then we pass inputs to LLM chain to transform the query, then pass to retriever
    query_transform_prompt | llm | StrOutputParser() | retriever).with_config(run_name="chat_retriever_chain")

    #Chain to retrieve from documents:
    document_chain = create_stuff_documents_chain(llm, question_answering_prompt)

    #The input from user is added to the message history:
    demo_ephemeral_chat_history.add_user_message(user_input)


    #If you want, you can print the transformed query as follows, just uncomment the next 4 lines:
    #Consider that this code will execute the invoke, such that this also consume resources from openAI
    #and will generate more tokens to process.

        #if len(demo_ephemeral_chat_history.messages) > 1:
    #    query_transformed = query_transform_prompt | llm | StrOutputParser()
    #    qry = query_transformed.invoke({"messages":demo_ephemeral_chat_history.messages})
    #    print(f"PRINTING QUERY TRANSFORMED, CONTENT IS: {qry}")


    #If you want, you can print the tokens count from messages as follows, just uncomment the print line:
    tokens_from_messages = countTokens(str(demo_ephemeral_chat_history.messages))
    #print(f"Tokens count, MESSAGES contains: {tokens_from_messages} tokens")

    #Clear the first 2 messages in history:
    if tokens_from_messages >= 1500:
        purge_messages_history(tokens_from_messages)

    #Retrieval chain using query transformation:
    conversational_retrieval_chain = RunnablePassthrough.assign(
    context=query_transforming_retriever_chain).assign(answer=document_chain)

    #Try Except to handle tokens limit
    try:
        #Get tokens and cost information:
        with get_openai_callback() as cb:
            response = conversational_retrieval_chain.invoke(
        {"messages": demo_ephemeral_chat_history.messages})
    except:
        purge_messages_history(tokens_from_messages)
        #Delete last user_input and ask to try again
        demo_ephemeral_chat_history.messages.pop(-1)
        return "Ocurrió un error, por favor intenta nuevamente."


    #Print token and cost information (optional):
    print(f"\n\tPRINTING RESULTS OF CB TOKENS: \n\t{cb}")

    #Print the entire response, this includes messages history and context (optional):
    print(f"\n\tPRINTING RESPONSE, CONTENT IS: \n\t{response}")
    #


    if(countTokens(response["answer"])<1000):
        #Response from AI is added to the message history:
        demo_ephemeral_chat_history.add_ai_message(response["answer"])


    #If you want you can print the tokens count only for "Context", just uncomment the next 2 lines:
    #tokens_from_context = countTokens(str(response["context"]))
    #print(f"\n\rTokens count, CONTEXT contains: {tokens_from_context} tokens")

    return response["answer"]


def purge_messages_history(tokens_from_messages: int):
    print(f"Tokens limit reached, there is {tokens_from_messages} tokens in MESSAGES")
    demo_ephemeral_chat_history.messages.pop(0)
    demo_ephemeral_chat_history.messages.pop(1)
    print("First message in historic messages deleted")
    tokens_from_messages = countTokens(str(demo_ephemeral_chat_history.messages))
    print(f"New tokens count. | MESSAGES contains: {tokens_from_messages} tokens")

def clear_history(count:int):
    #if count = 0 clear
    #if(count==0):
    #    demo_ephemeral_chat_history.clear()
    ##if count >0 just clear count messages
    #else:
    #    i = 0
    #    while(i<count):
    demo_ephemeral_chat_history.messages.clear()

    return demo_ephemeral_chat_history.messages
