from abc import ABC, abstractmethod

from server.schemas.listing import ListingCreate
from server.schemas.listing_parser import ListingParserGet
from server.schemas.listing_photo import ListingPhotoCreate


class Company(ABC):
    """
    Base abstract class for shipping container companies.

    This class provides a **registry mechanism** for all company implementations.
    Defines interface to get shipping container prices.
    """
    _companies: dict[str, type["Company"]] = {}

    def __init_subclass__(cls, **kwargs):
        """
        Register subclass implementation to registry for convenience
        """
        super().__init_subclass__(**kwargs)
        name = getattr(cls, "NAME", None)
        if name:
            Company._companies[name] = cls

    @staticmethod
    @abstractmethod
    def get_shipping_container_prices(*args, **kwargs) -> list[ListingCreate]:
        """
        Abstract method to retrieve shipping container prices for the company.
        This method must be implemented by every subclass.
        """
        pass

    @staticmethod
    def get_company(name: str) -> type["Company"]:
        """
        Get a registered company class by its name.
        """
        if name in Company._companies:
            return Company._companies[name]
        
        raise ValueError(f"Company {name} not registered.")
    
    @staticmethod
    def create_listing(listing_parse: ListingParserGet, ral_color: str | None, price: float | None, image_urls: list[str] = []) -> ListingCreate:
        return ListingCreate(
            title=f"{listing_parse.company_name} - {listing_parse.container_type} container",
            description=f"Container from {listing_parse.company_name}",
            container_type=listing_parse.container_type,
            type=listing_parse.type,
            condition=listing_parse.condition,
            location=listing_parse.location,
            ral_color=ral_color,
            price=price,
            currency=listing_parse.currency,
            original_url=listing_parse.url,
            photos=[
                ListingPhotoCreate(
                    photo_id=None, 
                    photo_url=image_url, 
                    is_main=(i == 0)
                ) 
                for i, image_url in enumerate(image_urls)
            ],
            dimension=listing_parse.dimension
        )