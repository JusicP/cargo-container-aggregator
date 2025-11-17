from enum import StrEnum

class NotificationType(StrEnum):
    LISTING_SENT_TO_MODERATION = "listing_sent_to_moderation"
    LISTING_PUBLISHED = "listing_published"
    LISTING_ERROR_FOUND = "listing_error_found"
    PARSER_FAILED = "parser_failed"
