"""
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json or {}
    hours = int(data.get('work_hours') or 40)
    stress = int(data.get('stress') or 5)
    score = round((hours / 40) * 50 + (stress / 10) * 50)
    risk = 'High' if score >= 70 else 'Medium' if score >= 40 else 'Low'
    return jsonify({'risk': risk, 'score': score})

if __name__ == '__main__':
    # listen on all interfaces so front-end (possibly in a container or different host)
    # can reach this backend. Keep default debug=False in production.
    app.run(host='0.0.0.0', port=5000)

"""
