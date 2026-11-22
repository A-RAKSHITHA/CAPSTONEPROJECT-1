import os
import joblib
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler

# All 24 validated Kaggle dataset features
FEATURE_COLUMNS = [
    'age', 'bp', 'sg', 'al', 'su', 'rbc', 'pc', 'pcc', 'ba',
    'bgr', 'bu', 'sc', 'sod', 'pot', 'hemo', 'pcv', 'wc', 'rc',
    'htn', 'dm', 'cad', 'appet', 'pe', 'ane'
]

NUMERIC_COLUMNS = [
    'age', 'bp', 'sg', 'al', 'su', 'bgr', 'bu', 'sc', 'sod', 'pot', 'hemo', 'pcv', 'wc', 'rc'
]

CATEGORICAL_COLUMNS = [
    'rbc', 'pc', 'pcc', 'ba', 'htn', 'dm', 'cad', 'appet', 'pe', 'ane'
]

CATEGORICAL_MAPPINGS = {
    'rbc': {'normal': 1, 'abnormal': 0},
    'pc': {'normal': 1, 'abnormal': 0},
    'pcc': {'present': 1, 'notpresent': 0},
    'ba': {'present': 1, 'notpresent': 0},
    'htn': {'yes': 1, 'no': 0},
    'dm': {'yes': 1, 'no': 0},
    'cad': {'yes': 1, 'no': 0},
    'appet': {'good': 1, 'poor': 0},
    'pe': {'yes': 1, 'no': 0},
    'ane': {'yes': 1, 'no': 0}
}


class CKDPreprocessor:
    def __init__(self):
        self.numeric_medians = {}
        self.categorical_modes = {}
        self.scaler = StandardScaler()
        self.is_fitted = False

    def clean_raw_dataframe(self, df):
        clean_df = df.copy()
        
        # Clean dirty string numeric columns common in the Kaggle dataset
        for col in ['pcv', 'wc', 'rc']:
            if col in clean_df.columns:
                clean_df[col] = clean_df[col].astype(str).str.replace('\t', '', regex=False).str.replace('?', '', regex=False).str.strip()
                clean_df[col] = pd.to_numeric(clean_df[col], errors='coerce')

        # Clean string categorical columns
        for col in CATEGORICAL_COLUMNS:
            if col in clean_df.columns:
                clean_df[col] = clean_df[col].astype(str).str.strip().str.replace('\t', '', regex=False).str.lower()
                clean_df[col] = clean_df[col].replace({'nan': np.nan, 'none': np.nan, '': np.nan, '?': np.nan})

        return clean_df

    def fit(self, df):
        clean_df = self.clean_raw_dataframe(df)

        # Compute medians for numeric
        for col in NUMERIC_COLUMNS:
            if col in clean_df.columns:
                med = clean_df[col].median()
                self.numeric_medians[col] = 0.0 if np.isnan(med) else float(med)
            else:
                self.numeric_medians[col] = 0.0

        # Compute modes for categorical
        for col in CATEGORICAL_COLUMNS:
            if col in clean_df.columns and not clean_df[col].dropna().empty:
                self.categorical_modes[col] = str(clean_df[col].mode()[0])
            else:
                self.categorical_modes[col] = 'normal' if col in ['rbc', 'pc'] else ('good' if col == 'appet' else 'no')

        transformed = self._impute_and_encode(clean_df)
        self.scaler.fit(transformed)
        self.is_fitted = True
        return self

    def _impute_and_encode(self, clean_df):
        res = pd.DataFrame(index=clean_df.index)

        # Impute numeric
        for col in NUMERIC_COLUMNS:
            if col in clean_df.columns:
                val = pd.to_numeric(clean_df[col], errors='coerce')
                res[col] = val.fillna(self.numeric_medians.get(col, 0.0))
            else:
                res[col] = self.numeric_medians.get(col, 0.0)

        # Impute and encode categorical
        for col in CATEGORICAL_COLUMNS:
            if col in clean_df.columns:
                val = clean_df[col].fillna(self.categorical_modes.get(col, 'no'))
            else:
                val = pd.Series(self.categorical_modes.get(col, 'no'), index=clean_df.index)
            
            # Map binary values
            mapping = CATEGORICAL_MAPPINGS.get(col, {})
            encoded = val.astype(str).str.lower().map(mapping).fillna(0)
            res[col] = encoded

        # Ensure column order
        return res[FEATURE_COLUMNS]

    def transform(self, df):
        if not self.is_fitted:
            raise ValueError("Preprocessor is not fitted yet!")
        clean_df = self.clean_raw_dataframe(df)
        X_df = self._impute_and_encode(clean_df)
        X_scaled = self.scaler.transform(X_df)
        return X_df, X_scaled

    def save(self, filepath):
        joblib.dump(self, filepath)

    @classmethod
    def load(cls, filepath):
        return joblib.load(filepath)
