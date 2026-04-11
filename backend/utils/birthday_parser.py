"""
birthday_parser.py
------------------
Parses a plain-text birthday file into (name, date) tuples.

Supported line formats:
  DD Mon  - Name
  DD Mon  — Name   (em dash)
  D Mon   - Name   (single-digit day)
  Name - DD Mon    (reversed)
  Blank lines and MONTH HEADER lines (ALL CAPS) are ignored.

Month abbreviations are case-insensitive (Jan / JAN / jan all work).
"""

import re
from datetime import date
from typing import NamedTuple, Optional, Tuple, List


MONTH_MAP = {
    "jan": 1,  "feb": 2,  "mar": 3,  "apr": 4,
    "may": 5,  "jun": 6,  "jul": 7,  "aug": 8,
    "sep": 9,  "oct": 10, "nov": 11, "dec": 12,
}

# Matches:  "4 Jan - Aaji"  or  "12 Feb — Chinmay"
_DATE_FIRST = re.compile(
    r"^\s*(\d{1,2})\s+([A-Za-z]{3})\s*[-–—]\s*(.+?)\s*$"
)

# Matches:  "Aaji - 4 Jan"
_NAME_FIRST = re.compile(
    r"^\s*(.+?)\s*[-–—]\s*(\d{1,2})\s+([A-Za-z]{3})\s*$"
)

# All-caps or all-caps+spaces → month section header, skip
_SECTION_HEADER = re.compile(r"^[A-Z\s]+$")


class ParsedBirthday(NamedTuple):
    name: str
    date: date


def parse_birthday_text(text: str) -> Tuple[List[ParsedBirthday], List[str]]:
    """
    Parse raw text into birthday entries.

    Returns:
        (entries, warnings)
        entries  – list of ParsedBirthday
        warnings – list of lines that could not be parsed
    """
    entries: List[ParsedBirthday] = []
    warnings: List[str] = []

    for raw_line in text.splitlines():
        line = raw_line.strip()

        # Skip blank lines and ALL CAPS section headers (e.g. "JANUARY")
        if not line or _SECTION_HEADER.match(line):
            continue

        parsed = _parse_line(line)
        if parsed:
            entries.append(parsed)
        else:
            warnings.append(line)

    return entries, warnings


def _parse_line(line: str) -> Optional[ParsedBirthday]:
    # Try DD Mon - Name
    m = _DATE_FIRST.match(line)
    if m:
        day_str, mon_str, name = m.group(1), m.group(2), m.group(3)
        bdate = _build_date(day_str, mon_str)
        if bdate:
            return ParsedBirthday(name=name.strip(), date=bdate)

    # Try Name - DD Mon
    m = _NAME_FIRST.match(line)
    if m:
        name, day_str, mon_str = m.group(1), m.group(2), m.group(3)
        bdate = _build_date(day_str, mon_str)
        if bdate:
            return ParsedBirthday(name=name.strip(), date=bdate)

    return None


def _build_date(day_str: str, mon_str: str) -> Optional[date]:
    month = MONTH_MAP.get(mon_str[:3].lower())
    if not month:
        return None
    try:
        return date(2000, month, int(day_str))  # year is a placeholder
    except ValueError:
        return None
