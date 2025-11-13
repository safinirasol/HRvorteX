# WellMind – VorteX HR Automation
# File: backend/services/hedera_service.py
# Description: Sends hashed audit records to Hedera Hashgraph for immutable transparency
# Author: Ahmad Yasser (Technical Architecture)
# License: MIT

import hashlib
import os
import json

def store_hash_on_hedera(record):
    """
    Store a hash of the burnout result on Hedera testnet for audit trail
    
    Args:
        record (dict): BurnoutResult data to hash and store
    
    Returns:
        str: Hedera transaction ID or file ID
    """
    
    hedera_account_id = os.getenv('HEDERA_ACCOUNT_ID')
    hedera_private_key = os.getenv('HEDERA_PRIVATE_KEY')
    
    if not hedera_account_id or not hedera_private_key:
        print("Hedera credentials not configured, simulating transaction")
        return _simulate_hedera_tx(record)
    
    try:
        from hedera import (
            Client,
            PrivateKey,
            AccountId,
            FileCreateTransaction
        )
        
        # Initialize Hedera client
        client = Client.for_testnet()
        client.set_operator(
            AccountId.from_string(hedera_account_id),
            PrivateKey.from_string(hedera_private_key)
        )
        
        # Hash the record
        record_str = json.dumps(record, sort_keys=True)
        record_hash = hashlib.sha256(record_str.encode()).hexdigest()
        
        # Store hash on Hedera
        tx = FileCreateTransaction() \
            .set_contents(record_hash.encode()) \
            .execute(client)
        
        receipt = tx.get_receipt(client)
        file_id = str(receipt.file_id)
        
        print(f"Hedera audit stored: {file_id}")
        return file_id
        
    except ImportError:
        print("Hedera SDK not installed, simulating transaction")
        return _simulate_hedera_tx(record)
    except Exception as e:
        print(f"Hedera transaction failed: {e}")
        return _simulate_hedera_tx(record)

def _simulate_hedera_tx(record):
    """Generate a simulated transaction ID for demo purposes"""
    record_str = json.dumps(record, sort_keys=True)
    record_hash = hashlib.sha256(record_str.encode()).hexdigest()
    return f"0.0.{record.get('id', 9999)}-{record_hash[:8]}"
