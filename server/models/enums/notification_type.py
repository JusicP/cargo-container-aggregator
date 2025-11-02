from enum import Enum

class NotificationType(str, Enum):
    LISTING_SENT_TO_MODERATION = "Оголошення направлено на модерацію"
    LISTING_PUBLISHED = "Оголошення пройшло модерацію та опубліковано"
    LISTING_HAS_ERROR = "У вашому оголошенні виявлено помилку"
    PARSER_FAILED = "Робота парсеру оголошень завершено з помилкою"
