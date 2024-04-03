# python std
import base64, json, requests
# Flask
from flask import Flask, request, jsonify

from concurrent.futures import ThreadPoolExecutor

executor = ThreadPoolExecutor(2)

app = Flask(__name__)

@app.route("/", methods=["POST"])
def handler():
    print("Task received", request.get_json())
    try:
        executor.submit(process, request.get_json())
        return jsonify({"message": "Doing the work..."})
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

def process(request):
    try:
        # 1) Receive available task.
        task_id = request["taskId"]
        counter = request["counter"]
        claim_url = request["links"]["claim"]
        complete_url = request["links"]["complete"]

        print("Claiming task", task_id, counter)

        # 2) Claim the task.
        claim_req = {
            "taskId": task_id,
            "counter": counter,
            "processId": "process-id",
            "executionId": "execution-id",
            "expiryInMilliseconds": 60
        }
        response = requests.post(claim_url, json=claim_req)
        response.raise_for_status()
        promise = response.json()

        print("Task claimed", task_id, counter)

        # 3) Do work on the task...
        summary = "This is a summary of the text"

        print("Completing task", task_id, counter)

        # 4) Complete the task.
        complete_req = {
            "taskId": task_id,
            "counter": counter,
            "executionId": "execution-id",
            "state": "resolved",
            "value": {
                "headers": {"Content-Type": "application/json"},
                # "data": base64.b64encode('"This is a summary of the text"'.encode()).decode()
                "data": base64.b64encode(f'"{summary}"'.encode()).decode()
            }
        }
        response = requests.post(complete_url, json=complete_req)
        response.raise_for_status()

        print("Task completed", task_id, counter)

    except Exception as e:
        print(f"Error: {str(e)}")
        
if __name__ == "__main__":
    print("Starting worker on port 5001\n")
    app.run(port=5001)