import pathlib

from dotenv import load_dotenv
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """holds environment variables"""

    debug: bool = False
    default_username: str = "default_username"
    default_age: int = 18

    # AWS batch
    aws_batch_job_queue: str = "dna-example-web-app-stage-batch-ec2-job-queue"
    aws_batch_job_bucket: str = "dna-example-web-app-stage-batch-job"
    aws_batch_job_definition: str = "dna-example-web-app-stage-batch-ec2-job-definition"
    aws_batch_job_timeout: int = 900


# load .env file from this directory into the environment variables
load_dotenv(pathlib.Path(__file__).parent / ".env")

# load settings based on environment variables
settings = Settings()
