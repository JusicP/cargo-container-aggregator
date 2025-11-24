from enum import Enum
from pydantic import BaseModel


class ContainerType(str, Enum):
    GENERAL_PURPOSE = "General Purpose (Dry Cube)"
    HIGH_CUBE = "High Cube"
    PALLET_WIDE = "Pallet Wide"
    REFRIGERATED = "Refrigerated (Reefer)"
    INSULATED = "Insulated"
    VENTILATED = "Ventilated"
    OPEN_TOP = "Open Top"
    HARD_TOP = "Hard Top"
    PLATFORM = "Platform"
    FLAT_RACK = "Flat Rack"
    TANK = "Tank Container"
    BULK = "Bulk Container"
    SPECIAL = "Special Purpose"
    DOUBLE_DOOR = "Double Door"
    SIDE_DOOR = "Side Door"
    GP_DC = "GP / DC (General Purpose / Dry Cube)"
    HC_HQ = "HC / HQ (High Cube)"
    PW = "PW (Pallet Wide)"
    RE_RT_RS = "RE / RT / RS (Reefer)"
    HI_HR = "HI / HR (Insulated)"
    VH = "VH (Ventilated)"
    OT = "OT (Open Top)"
    HT = "HT (Hard Top)"
    PL_PF_PC_PS = "PL / PF / PC / PS (Platform family)"
    FR = "FR (Flat Rack)"
    TN_TG_TD = "TN / TG / TD (Tank)"
    BU_BK = "BU / BK (Bulk)"
    SN = "SN (Special)"
    DD = "DD (Double Door)"
    SD = "SD (Side Door)"


class ContainerCondition(str, Enum):
    NEW = "new"
    USED = "used"
    REFURBISHED = "refurbished"


class ContainerDimension(str, Enum):
    STANDARD_20 = "20ft (20DC)"
    STANDARD_40 = "40ft (40DC)"
    HIGH_CUBE_40 = "40ft High Cube (40HC)"
    HIGH_CUBE_45 = "45ft High Cube (45HC)"
    HIGH_CUBE_53 = "53ft High Cube (53HC)"


class ContainerInfo(BaseModel):
    container_type: ContainerType
    condition: ContainerCondition
    dimension: ContainerDimension
