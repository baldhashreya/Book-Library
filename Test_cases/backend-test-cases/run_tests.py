import argparse
import os
import subprocess
import shutil
import sys

def run_pytest(env="local", clean=False, report=False, extra_args=None):
    """
    Runs pytest with the specified environment and options.
    """
    # Set environment variable for conftest.py
    os.environ["PYTEST_ENV"] = env
    print(f"[*] Running tests in [{env}] environment...")

    base_dir = os.path.dirname(os.path.abspath(__file__))
    allure_results = os.path.join(base_dir, "allure-results")
    allure_report = os.path.join(base_dir, "allure-report")

    # Cleanup old results if requested
    if clean:
        print("[*] Cleaning old Allure results and reports...")
        if os.path.exists(allure_results):
            shutil.rmtree(allure_results)
        if os.path.exists(allure_report):
            shutil.rmtree(allure_report)

    # Prepare pytest command
    cmd = [
        "pytest",
        f"--alluredir={allure_results}",
        "--clean-alluredir" if clean else ""
    ]
    
    # Remove empty strings from cmd
    cmd = [c for c in cmd if c]

    if extra_args:
        cmd.extend(extra_args)

    # Run pytest
    try:
        print(f"[*] Executing: {' '.join(cmd)}")
        result = subprocess.run(cmd, check=False)
        
        if report:
            generate_report(allure_results, allure_report)
            
        return result.returncode
    except FileNotFoundError:
        print("[!] Error: 'pytest' not found. Please ensure it is installed in your virtual environment.")
        return 1
    except Exception as e:
        print(f"[!] An error occurred: {e}")
        return 1

def generate_report(results_dir, report_dir):
    """
    Generates and opens the Allure report.
    """
    if not os.path.exists(results_dir):
        print("[!] No Allure results found. Skipping report generation.")
        return

    print("[*] Generating Allure report...")
    try:
        # Check if allure is installed
        subprocess.run(["allure", "--version"], check=True, capture_output=True)
        
        # Generate report
        subprocess.run(["allure", "generate", results_dir, "-o", report_dir, "--clean"], check=True)
        print(f"[*] Report generated at: {report_dir}")
        
        # Open report
        print("[*] Opening Allure report...")
        subprocess.run(["allure", "open", report_dir], check=False)
    except FileNotFoundError:
        print("[!] Error: 'allure' command not found. Please install Allure CLI to generate reports.")
    except subprocess.CalledProcessError as e:
        print(f"[!] Failed to generate report: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Pytest Runner Script with Allure support")
    parser.add_argument("--env", type=str, default="local", help="Environment to run tests in (local, dev, etc.)")
    parser.add_argument("--clean", action="store_true", help="Clean allure-results before running")
    parser.add_argument("--report", action="store_true", help="Generate and open Allure report after tests")
    
    args, unknown = parser.parse_known_args()
    
    exit_code = run_pytest(env=args.env, clean=args.clean, report=args.report, extra_args=unknown)
    sys.exit(exit_code)
