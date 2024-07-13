from enum import Enum

class CeleryStatus(Enum):
    COMPLETED = "Completed"
    STARTED = "Started"
    FAILED = "Failed"