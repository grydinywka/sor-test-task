The Flask app is testing task!

For launching one execute next:

$ virtualenv test_task --no-site-packages

$ cd test_task

$ source bin/activate

$ git clone https://github.com/grydinywka/sor-test-task.git

$ cd sor-test-task/

$ pip install -r requirements.txt

$ mkdir app/logs

$ gunicorn app.views:app


And open http://127.0.0.1:8000

