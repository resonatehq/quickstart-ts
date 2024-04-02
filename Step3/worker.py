# python std
import base64, json, requests
# Flask
from flask import Flask, request, jsonify

from concurrent.futures import ThreadPoolExecutor

app = Flask(__name__)

exe = ThreadPoolExecutor(2)

API_URL = "http://localhost:8001"
CLAIM_URL = API_URL + "/tasks/claim"
COMPLETE_URL = API_URL + "/tasks/complete"


@app.route("/", methods=["POST"])
def handler():
    print("Task received", request.get_json())
    try:
        exe.submit(process, request.get_json())
        return "OK", 200
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

def process(request):
    try:

        req = request
        task_id = req["taskId"]
        counter = req["counter"]


        # 1) Claim the task.
        print("Claiming task", request)
        response = requests.post(CLAIM_URL, json = {    #request['links']['claim'], json={
            "taskId": task_id,
            "counter": counter,
            "processId": "process-id",
            "executionId": "execution-id",
            "expiryInSeconds": 60
        })
        response.raise_for_status()


        # 2) Do work on the task...
        promise = response.json()

        print("Download and summarize", promise)

        summary = "This is a summary of the text"

        # 3) Complete the task.
        complete_req = {
            "taskId": task_id,
            "counter": counter,
            "executionId": "execution-id",
            "state": "resolved",
            "value": {
                "headers": {"Content-Type": "application/json"},
                "data": base64.b64encode(f'"{summary}"'.encode()).decode()
            }
        }
        response = requests.post(COMPLETE_URL, json=complete_req)
        response.raise_for_status()

        print("Task completed", task_id, counter)

    except Exception as e:
        print(f"Error: {str(e)}")
        
if __name__ == "__main__":
    print("Starting worker on port 5001\n")
    app.run(port=5001)