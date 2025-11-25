import logging
from bs4 import BeautifulSoup

from server.schemas.listing_parser import ListingParserGet
from server.scraper.sources.bs import BSCompany

logger = logging.getLogger(__name__)
# TODO: set formatter to specify datetime and company class in [] brackets  
# logger.setFormatter()


class Brinkbox(BSCompany):
    NAME = 'BS_BRINKBOX'

    @classmethod
    def get_shipping_container_prices_from_page(cls, soup: BeautifulSoup, listing_parse: ListingParserGet):
        variant_color_labels = soup.find_all(class_='iqf-color-label')
        variant_prices = soup.find_all(attrs={"data-price": True})
        total_price = soup.find_all(class_='price-title is-total')

        if not variant_color_labels and not variant_prices and not total_price:
            return []

        images = cls.get_image_urls(soup)

        container_list = []
        if variant_color_labels and variant_prices:
            for label, price in zip(variant_color_labels, variant_prices):
                color = label.get_text(strip=True)[:7]

                container_list.append(
                    cls.create_listing(listing_parse, color, float(price['data-price']), images)
                )
        else:
            if len(total_price) > 1:
                logger.warning(f"[Warn] [Brinkbox] More than one total price found on {listing_parse.url}, using the first one.")

            price = color = None
            if total_price:
                price = float(total_price[0]['data-base'])
                
            # fallback
            container_list.append(
                cls.create_listing(listing_parse, color, price, images)
            )
        return container_list

    @classmethod
    def get_image_urls(cls, soup: BeautifulSoup) -> list[str]:
        base_url = "https://www.brinkbox.nl"
        image_urls = []

        gallery_items = soup.select('.sec-n-prod .gallery-item')

        for item in gallery_items:
            if item.has_attr('data-large-src'):
                relative_url = item['data-large-src']
                image_urls.append(f"{base_url}{relative_url}")

        if not image_urls:
            main_img = soup.select_one('.sec-n-prod .gallery-link[data-src]')
            if main_img:
                image_urls.append(f"{base_url}{main_img['data-src']}")

        return list(dict.fromkeys(image_urls))