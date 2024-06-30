from enum import Enum

class BlastQueryStatus(Enum):
    COMPLETED = "Completed"
    IN_PROGRESS = "In progress"
    FAILED = "Failed"