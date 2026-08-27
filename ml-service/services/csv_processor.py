import pandas as pd
import numpy as np
from io import BytesIO


COLUMN_ALIASES = {
    "company_name": [
        "company_name",
        "companyname"
    ],

    "financial_year": [
        "financial_year",
        "financialyear"
    ],

    "company_type": [
        "psu_non_psu",
        "psu_non-psu",
        "psu_nonpsu"
    ],

    "csr_state": [
        "csr_state"
    ],

    "csr_sector": [
        "csr_development_sector",
        "csrdevelopmentsector"
    ],

    "csr_sub_sector": [
        "csr_sub_development_sector",
        "csrsubdevelopmentsector"
    ],

    "project_amount": [
        "project_amount_spent_in_inr_cr",
        "project_amount_spent_in_inr_cr_"
    ]
}


def normalize_column_name(column):
    """
    Converts different column-name styles into
    a consistent internal format.
    """

    return (
        str(column)
        .strip()
        .lower()
        .replace(" ", "_")
        .replace("/", "_")
        .replace("(", "")
        .replace(")", "")
        .replace(".", "")
    )


def normalize_columns(df):
    """
    Normalize every CSV column.
    """

    df = df.copy()

    df.columns = [
        normalize_column_name(column)
        for column in df.columns
    ]

    return df


def find_column(df, aliases, logical_name):
    """
    Find the actual dataset column using aliases.
    """

    for alias in aliases:

        if alias in df.columns:
            return alias

    raise ValueError(
        f"Required column '{logical_name}' not found. "
        f"Available columns: {list(df.columns)}"
    )


def load_csv(file_bytes):
    """
    Read uploaded CSV bytes into pandas.
    """

    if not file_bytes:
        raise ValueError("Uploaded CSV is empty.")

    try:

        df = pd.read_csv(
            BytesIO(file_bytes)
        )

    except Exception as error:

        raise ValueError(
            f"Unable to read CSV: {str(error)}"
        )

    if df.empty:

        raise ValueError(
            "The uploaded CSV contains no records."
        )

    print("\n========== ORIGINAL DATASET ==========")
    print("Rows:", len(df))
    print("Columns:", list(df.columns))
    print("======================================\n")

    return df


def prepare_dataset(df):
    """
    Clean and convert the actual CSR dataset
    into the internal format used by the ML pipeline.
    """

    df = normalize_columns(df)

    # --------------------------------------------------------
    # Locate columns
    # --------------------------------------------------------

    company_col = find_column(
        df,
        COLUMN_ALIASES["company_name"],
        "Company Name"
    )

    financial_col = find_column(
        df,
        COLUMN_ALIASES["financial_year"],
        "Financial Year"
    )

    company_type_col = find_column(
        df,
        COLUMN_ALIASES["company_type"],
        "PSU/Non-PSU"
    )

    state_col = find_column(
        df,
        COLUMN_ALIASES["csr_state"],
        "CSR State"
    )

    sector_col = find_column(
        df,
        COLUMN_ALIASES["csr_sector"],
        "CSR Development Sector"
    )

    sub_sector_col = find_column(
        df,
        COLUMN_ALIASES["csr_sub_sector"],
        "CSR Sub Development Sector"
    )

    amount_col = find_column(
        df,
        COLUMN_ALIASES["project_amount"],
        "Project Amount Spent (In INR Cr.)"
    )

    # --------------------------------------------------------
    # Rename to internal names
    # --------------------------------------------------------

    df = df.rename(
        columns={
            company_col: "company_name",
            financial_col: "financial_year",
            company_type_col: "company_type",
            state_col: "csr_state",
            sector_col: "csr_sector",
            sub_sector_col: "csr_sub_sector",
            amount_col: "project_amount"
        }
    )

    # --------------------------------------------------------
    # Clean text columns
    # --------------------------------------------------------

    text_columns = [
        "company_name",
        "financial_year",
        "company_type",
        "csr_state",
        "csr_sector",
        "csr_sub_sector"
    ]

    for column in text_columns:

        df[column] = (
            df[column]
            .fillna("")
            .astype(str)
            .str.strip()
        )

    # --------------------------------------------------------
    # Clean project amount
    # --------------------------------------------------------

    df["project_amount"] = (
        df["project_amount"]
        .astype(str)
        .str.replace(",", "", regex=False)
        .str.replace("₹", "", regex=False)
        .str.strip()
    )

    df["project_amount"] = pd.to_numeric(
        df["project_amount"],
        errors="coerce"
    )

    df["project_amount"] = (
        df["project_amount"]
        .fillna(0)
    )

    # --------------------------------------------------------
    # Remove records without company names
    # --------------------------------------------------------

    df = df[
        df["company_name"].str.len() > 0
    ].copy()

    if df.empty:

        raise ValueError(
            "No valid company records were found."
        )

    print("\n========== CLEAN DATASET ==========")
    print("Valid records:", len(df))
    print("Companies:", df["company_name"].nunique())
    print("===================================\n")

    return df