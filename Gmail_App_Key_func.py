def Gmail_App_Key():
    import os
    from dotenv import load_dotenv

    load_dotenv()
    return os.getenv('GMAIL_APP_KEY')