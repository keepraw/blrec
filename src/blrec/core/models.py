from typing import Literal

import attr


@attr.s(auto_attribs=True, frozen=True, slots=True)
class DanmuMsg:
    mode: int
    size: int  # font size
    color: int
    date: int  # a timestamp in miliseconds
    dmid: int
    pool: int
    uid_hash: str
    uid: int
    uname: str  # sender name
    text: str


@attr.s(auto_attribs=True, slots=True, frozen=True)
class UserToastMsg:
    start_time: int  # timestamp in seconds
    uid: int
    username: str
    unit: str
    num: int
    price: int
    role_name: str
    guard_level: str
    toast_msg: str


@attr.s(auto_attribs=True, frozen=True, slots=True)
class GiftSendMsg:
    gift_name: str
    count: int
    coin_type: Literal['sliver', 'gold']
    price: int
    uid: int
    uname: str
    timestamp: int  # timestamp in seconds


@attr.s(auto_attribs=True, frozen=True, slots=True)
class GuardBuyMsg:
    gift_name: str
    count: int
    price: int
    uid: int
    uname: str
    guard_level: int  # 1 总督, 2 提督, 3 舰长
    timestamp: int  # timestamp in seconds


@attr.s(auto_attribs=True, frozen=True, slots=True)
class SuperChatMsg:
    gift_name: str
    count: int
    price: int
    rate: int
    time: int  # duration in seconds
    message: str
    uid: int
    uname: str
    timestamp: int  # timestamp in seconds
