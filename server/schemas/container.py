from enum import Enum


class ContainerType(str, Enum):
    STANDARD = "standard"
    GENERAL_PURPOSE = "general_purpose"
    HIGH_CUBE = "high_cube"
    PALLET_WIDE = "pallet_wide"
    REFRIGERATED = "reefer"
    INSULATED = "insulated"
    VENTILATED = "ventilated"
    OPEN_TOP = "open_top"
    HARD_TOP = "hard_top"
    PLATFORM = "platform"
    FLAT_RACK = "flat_rack"
    TANK = "tank"
    BULK = "bulk"
    SPECIAL = "special_purpose"
    DOUBLE_DOOR = "double_door"
    SIDE_DOOR = "side_door"


class ContainerDimension(str, Enum):
    FT4 = "ft4"
    FT6 = "ft6"
    FT8 = "ft8"
    FT10 = "ft10"
    FT20 = "ft20"
    FT40 = "ft40"
    FT45 = "ft45"
    FT53 = "ft53"
    UNKNOWN = "unknown"


class ContainerCondition(str, Enum):
    NEW = "new"
    USED = "used"
    REFURBISHED = "refurbished"
