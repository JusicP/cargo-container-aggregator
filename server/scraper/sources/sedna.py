

import re
import logging
from bs4 import BeautifulSoup

from server.schemas.listing_parser import ListingParserGet
from server.scraper.sources.bs import BSCompany

logger = logging.getLogger(__name__)
# TODO: set formatter to specify datetime and company class in [] brackets  
# logger.setFormatter()


class SEDNA(BSCompany):
    NAME = 'SEDNA'

    @classmethod
    def get_shipping_container_prices_from_page(cls, soup: BeautifulSoup, listing_parse: ListingParserGet):
        listing_list = []
        price_segment = soup.find(class_="detail-price")
        assert price_segment
        price_raw = price_segment.text.strip()
        price = float(re.sub(r"[^0-9,]", "", price_raw).replace(',', '.'))
        if price == 0:
            raise ValueError("Failed to get price")
        
        ral_colors = []
        for li in soup.select("ul.c-product-info__single__list li"):
            spans = li.find_all("span")
            if len(spans) == 2 and spans[0].get_text(strip=True).lower() == "kleur":
                # Extract all RAL color codes with regex
                text = spans[1].get_text(strip=True)
                ral_colors += re.findall(r"RAL\s?\d{4}", text, re.IGNORECASE)

        for color in ral_colors:
            if not color.startswith("RAL "):
                continue
            
            color_code = color[-4:]
            listing_list.append(
                cls.create_listing(
                    listing_parse=listing_parse,
                    ral_color=color_code,
                    price=price, # prices on Sedna are the same for all colors
                )
            )

        return listing_list

    