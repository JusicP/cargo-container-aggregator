import re
import logging
from bs4 import BeautifulSoup

from server.schemas.listing_parser import ListingParserGet
from server.scraper.sources.bs import BSCompany

logger = logging.getLogger(__name__)
# TODO: set formatter to specify datetime and company class in [] brackets  
# logger.setFormatter()


class Caru(BSCompany):
    NAME = 'BS_CARU'

    @classmethod
    def get_shipping_container_prices_from_page(cls, soup: BeautifulSoup, listing_parse: ListingParserGet):
        price_tag = soup.find('span', class_='product-detail-addtocart__price')
        container_list = []

        price = None
        if price_tag:
            price_raw = price_tag.text.strip()
            price = float(re.sub(r"[^0-9,]", "", price_raw).replace(',', '.'))

        color_inputs = soup.find_all('input', attrs={'name': 'ProductColorRalCode'})

        image_urls = cls.get_image_urls(soup)

        color = None
        if color_inputs:
            for input_tag in color_inputs:
                color = "RAL" + str(input_tag['value'][4:8])
                container_list.append(
                    cls.create_listing(listing_parse, color, price, image_urls)
                )
        else:
            container_list.append(
                cls.create_listing(listing_parse, color, price, image_urls)
            )

        return container_list

    @classmethod
    def get_image_urls(cls, soup: BeautifulSoup) -> list[str]:
        image_urls = []
        
        images = soup.select('.product-carousel__container .product-carousel__container__item img')

        for img in images:
            src = img.get('src')
            if src:
                if src.startswith("//"):
                    src = "https:" + src
                
                if src not in image_urls:
                    image_urls.append(src)

        return image_urls