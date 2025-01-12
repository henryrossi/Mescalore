# Welcome to Mescolare

## Setting up the developer environment

- Start by cloning this repo.
- Copy respective .env files to ./frontend and ./backend/backend direcotries.
- Make sure you have node installed. You can verify this by running `npm -v`.
- In the ./frontend directory run `npm install`.
- Install postgresql if you don't have it installed already. Create a database for Mescolare 
by running `createdb <dbname>`. Open up the database with `psql <dbname>`. Create a new user: 
`CREATE USER <username> WITH PASSWORD '<password>' CREATEDB;`. Grant superuser status:
`ALTER USER <username> WITH SUPERUSER;`. You can use the command `\du` to show all of the users
and their priviliges.
- Confirm you have python installed and are running version 3.12 and below: `python3 --version`.
- Create a virtual environment for the python package installation: `python3 -m venv 
backend/.venv`.
- Activate the virtual environment with `source backend/.venv/bin/activate`.
- Install the required packages: `pip3 install -r backend/requirements.txt`.
- Finally, populate the database by running `python3 backend/manage.py migrate`.

To start the django backend development server run `python3 backend/manage.py runserver`.
To start the frontend app move into the ./frontend directory and run `npm start`.
Alternatively you could run the start_up.sh script which does both.


## Deploy instrucitons

To deploy your changes, simply merge your working branch into main.

