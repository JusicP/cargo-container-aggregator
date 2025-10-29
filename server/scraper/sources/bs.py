from abc import abstractmethod
import requests
from bs4 import BeautifulSoup

from server.scraper.company import Company
from server.schemas.listing_parser import ListingParserGet
from server.schemas.listing import ListingCreate


class BSCompany(Company):
    DEFAULT_PRICE = None

    @staticmethod
    def get_soup(url: str | bytes):
        headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/122.0.0.0 Safari/537.36"
            ),
            "Accept-Language": "en-US,en;q=0.9",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Referer": "https://www.google.com"
        }
        page = requests.get(url, headers=headers) # TODO: check status code
        return BeautifulSoup(page.content, "html.parser")

    @classmethod
    def get_shipping_container_prices(cls, listing_parse: ListingParserGet, *args, **kwargs) -> list[ListingCreate]:
        return cls.get_shipping_container_prices_from_page(
            BSCompany.get_soup(listing_parse.url),
            listing_parse
        )

    @classmethod
    @abstractmethod
    def get_shipping_container_prices_from_page(cls, soup: BeautifulSoup, listing_parse: ListingParserGet) -> list[ListingCreate]:
        pass
