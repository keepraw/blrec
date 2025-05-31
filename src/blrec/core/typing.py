from typing import Union

from blrec.flv.operators import MetaData as FLVMetaData
from blrec.hls.operators import MetaData as HLSMetaData

MetaData = Union[FLVMetaData, HLSMetaData]
