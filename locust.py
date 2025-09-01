import time
import random
import string
from faker import Faker
from locust import HttpUser, task, between


fake = Faker()

class TaskFlowSistem (HttpUser):
    wait_time = between(1, 5)
    
    ## string random generator
    def random_string(self, length=5):
            return ''.join(random.choices(string.ascii_letters + string.digits, k=length))
    
    ## password generator
    def random_password_generation(self, length=12):
        if length < 8:
            length = 8  

        capital_letters = string.ascii_uppercase
        digits = string.digits
        special = "!@#$%^&*()-_=+[]{}|;:,.<>?/"

        password = [
            random.choice(capital_letters),
            random.choice(digits),
            random.choice(special)
        ]

        all_characters = capital_letters + digits + special + string.ascii_letters
        while len(password) < length:
            password.append(random.choice(all_characters))

        random.shuffle(password)

        passwird_str = ''.join(password)
        return passwird_str

    def on_start(self):

        unique_id = self.random_string()
        password_gen = self.random_password_generation()
        self.first_name = fake.first_name()
        self.last_name = fake.last_name()
        self.email = f"{self.last_name}{unique_id}@gmail.com"

        payload = {
            "First_name": self.first_name,
            "Last_name": self.last_name,
            "Age": str(random.randint(18,60)),
            "Username": f"{self.first_name}{unique_id}",
            "Email": self.email,
            "Password": f"{password_gen}",
            "Roles": 10
        }

        self.client.post("/api/Auth/register", json=payload, verify=False)

    @task
    def password_recovery(self):
        payload = {"Email": self.email}
        self.client.put("/api/Auth/forget-account", json=payload, verify=False)
    
    @task
    def register_recovery(self):
        unique_id = self.random_string()
        
        first_name= fake.first_name()
        last_name = fake.last_name()

        password_gen = self.random_password_generation()
                
        payload = {
            "First_name": first_name,
            "Last_name": last_name,
            "Age": str(random.randint(18,60)),
            "Username": f"{first_name}{unique_id}",
            "Email": f"{last_name}{unique_id}@gmail.com",
            "Password": f"{password_gen}",
            "Roles": 10
        }
        
        self.client.post(
            url= "/api/Auth/register",
            json=payload,
            verify=False
            )
        
    @task
    def verify_account(self):
        payload = {
            "Email": self.email,
            "VerifyCode": self.verify_code
        }
        self.client.put("/api/Auth/verify-account", json=payload, verify=False)

    @task
    def password_recovery(self):
        payload = {"Email": self.email}
        self.client.put("/api/Auth/forget-account", json=payload, verify=False)

    @task
    def password_reset(self):
        password_gen = self.random_password_generation()
        payload = {
            "Email": self.email,
            "VerifyCode": self.verify_code,
            "Password": f"{password_gen}"
        }
        self.client.patch("/api/Auth/recuperation-account", json=payload, verify=False)