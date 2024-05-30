import logging
import uuid
from enum import Enum

import boto3
from fastapi import APIRouter
from pydantic import BaseModel

from app.settings import settings


class BatchJobResponse(BaseModel):
    jobArn: str
    jobName: str
    jobId: str


class BatchJobStatus(Enum):
    SUBMITTED = "SUBMITTED"
    PENDING = "PENDING"
    RUNNABLE = "RUNNABLE"
    STARTING = "STARTING"
    RUNNING = "RUNNING"
    SUCCEEDED = "SUCCEEDED"
    FAILED = "FAILED"


class BatchJobDescription(BaseModel):
    status: BatchJobStatus
    statusReason: str = ""
    jobId: str
    jobName: str
    createdAt: int
    startedAt: int = -1
    stoppedAt: int = -1


def submit_batch_job(
    job_name: str,
    job_definition: str,
    job_queue: str,
    job_timeout: int,
    job_command: list[str],
) -> BatchJobResponse:
    """
    Submit a job to find the solution for a previously built instance file
    """
    batch_client = boto3.client("batch")

    # should only get the active job revision
    result = batch_client.describe_job_definitions(
        jobDefinitionName=job_definition,
        status="ACTIVE",
    )
    job_definition_arn = result["jobDefinitions"][0]["jobDefinitionArn"]

    # ruff: noqa: N815
    kwargs = {
        "jobDefinition": job_definition_arn,
        "jobQueue": job_queue,
        "jobName": job_name,
        "timeout": {
            "attemptDurationSeconds": job_timeout,
        },
        "containerOverrides": {
            "command": job_command,
        },
    }

    batch_job = batch_client.submit_job(**kwargs)
    return BatchJobResponse.model_validate(batch_job)


def get_batch_job(job_name: str, job_queue: str) -> BatchJobDescription:
    batch_client = boto3.client("batch")
    kwargs = {
        "jobQueue": job_queue,
        "filters": [
            {"name": "JOB_NAME", "values": [job_name]},
        ],
    }
    job_description = batch_client.list_jobs(**kwargs)["jobSummaryList"][0]
    return BatchJobDescription.model_validate(job_description)


def run_example_job(job_name: str):
    import sys

    import torch

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)s | %(message)s",
        stream=sys.stdout,
    )
    logging.info("Running job %s", job_name)

    logging.info("Is torch available? %s", torch.cuda.is_available())


# Add the route_class to ensure this router uses additional context.
router = APIRouter()


@router.post("/job", response_model=BatchJobResponse)
def submit_job():
    job_name = str(uuid.uuid4())
    return submit_batch_job(
        job_name=job_name,
        job_definition=settings.aws_batch_job_definition,
        job_queue=settings.aws_batch_job_queue,
        job_timeout=settings.aws_batch_job_timeout,
        job_command=[
            "python3",
            "-c",
            f"from app.batch_job import run_example_job; run_example_job('{job_name}')",
        ],
    )


@router.get("/job/{job_name}", response_model=BatchJobDescription)
def get_job(job_name: str):
    return get_batch_job(job_name, settings.aws_batch_job_queue)
