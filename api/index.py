import sys
import os
from mangum import Mangum

# Add the root directory to the path so we can import backend.app.main
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app.main import app

handler = Mangum(app)
