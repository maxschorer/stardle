#!/usr/bin/env python3
from bs4 import BeautifulSoup
import os
from pathlib import Path
import re
import requests
import shutil
from supabase import create_client
import sys
import time

HEADERS = {
    "Cookie": "_ga=GA1.1.1239591174.1748461701; _li_dcdm_c=.2kratings.com; _lc2_fpi=e82402882df6--01jwc70jm3c7t7vajzhxvs1ahn; _lc2_fpi_meta=%7B%22w%22%3A1748461701763%7D; _lr_env_src_ats=false; usnatUUID=e40e1a20-b940-48bb-85f5-b96d45292c9a; pbjs_fabrickId=%7B%22fabrickId%22%3A%22E1%3ANtCey3eV2MoSaJGU2H06j7rFZYvBp6s7UmruHe0xicyrWPh4joYpjXGGkboW3-R3dPeGTLIcG9uoepknnHkFC5UDSmNzkdAVIkLQd5wiHyQo4iwSUAuR5H7Cl8yWj79X%22%7D; _sharedid=3a29f146-f153-424e-a327-5d0147cf98d3; _cc_id=e3281a408c53801f56656b5b71a5ca51; panoramaId_expiry=1749066502247; panoramaId=fe303bffb53d4cb9bc362914882e16d53938b9aa48c69c97f4335fc00879e1a6; panoramaIdType=panoIndiv; hb_insticator_uid=70b11298-be26-41ab-8dde-c2b22378e188; ccuid=d65c3f76-4cb0-42cf-8541-31272a9dde52; _lr_sampling_rate=100; ab.storage.deviceId.240e177d-4779-41c2-b484-3af37ffa8685=%7B%22g%22%3A%22dc33a535-a0d9-fa32-4289-c07c70b3cb25%22%2C%22c%22%3A1748461710919%2C%22l%22%3A1748461710919%7D; gamera_user_id=1fbbb87f-c77e-4b93-bd42-c292bfa4448d; __qca=P1-57a65e3e-4667-45a1-b03f-9de1b3d618fe; _sharedid_cst=1CynLLQsLA%3D%3D; pbjs_fabrickId_cst=1CynLLQsLA%3D%3D; _ga_3T5BDY5K12=GS2.1.s1748461701$o1$g1$t1748464779$j59$l0$h0; cto_bundle=SFJqIV9yQzR1UXF3WFR0QTMwVDVURFVISldxeXM0RzR5dGM0b2IlMkZGMDlESmVqVjA0T0FBYldCcGFCb3ZYUW43a2gwdWhSaHpqeDFwblZkOXlEakN0UEROaEI3MGklMkI3aHhET2taRDVFd0tDYm5xRTNPQUQlMkJoVjdoUFlwRzJCT3NLNDd0S1QlMkIyUmk1UVdaTVB6cU9VZkVwTXlJVWZDNm40azZNJTJCQ2g2amQ5bjZneHA3eWpVZlA5enBENGtaN3R1WW53OGRaJTJGYjEwSVgxNTFyN0hMamlpVXpEUUpMUjZuc3RpbTNHRldPaDRHZGVucmVzMllHbVBjWTVyTEFRVXZ4a2VaRnRJS3dlN1l3WXZab1RLbG85Y3VHcTI2N0REekYlMkZBRmF4bjlROE80QlNoa3dVanV0NUNzUkFobXV5NVozTmtaWk91; cto_bidid=-OnIR193VW9yOFZrWEViYzUlMkIyTU9XaUJQc0RpQ21KWVBjMm5Pa2lCMXVrb3lHMm1obm9pZWtFNjI4RUtqTklkdUpWV0NzVEhrVGtnQ0x1WHZkbGUlMkI1RzlCaXpYTVBmak0wN1c1dTltTFMlMkZZNzAxcSUyQmwxNThkSzBPbHFWM01BV05ZSzJYeHZ3bU1qVSUyRmY2Y2U5RkU0dmpDU21BJTNEJTNE; _lr_retry_request=true; __gads=ID=d7905af9f06b0a0c:T=1748461703:RT=1748468887:S=ALNI_MabSBbgERAhwG0t7fVSWitb3B-hLw; __gpi=UID=000010cf110e46e2:T=1748461703:RT=1748468887:S=ALNI_MYQpCc3SlFi8fu1mRaJpfRLeq9TLw; __eoi=ID=4bc9d8be7814fe1d:T=1748461704:RT=1748468887:S=AA-AfjYKzVIsomU56-NsyplfZJEa",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"
}
POSTION_MAP = {
    'Small Forward': 'SF',
    'Point Guard': 'PG',
    'Power Forward': 'PF',
    'Shooting Guard': 'SG',
    'Center': 'C'
}

def get_years_from_html(html: str) -> int:
    pattern = r"Year\(s\) in the NBA:\s*(\d+)"
    match = re.search(pattern, html)
    if match:
        return int(match.group(1))
    return None

def get_image_path():
    script_dir = Path(__file__).parent
    return script_dir.parent / 'public' / 'images' 

def get_current_images(dir):
    dir_path = get_image_path() / dir
    return os.listdir(dir_path)

def save_image(file_name, img_url):
    image_dir = get_image_path()
    response = requests.get(img_url, headers=HEADERS)
    image_path = image_dir / file_name
    with open(image_path, 'wb') as f:
        f.write(response.content)

def clean_permalink(p):
    return p.split('-all-time')[0]

def parse_player_page(permalink):
    html = requests.get(f'https://www.2kratings.com/{permalink}', headers=HEADERS).text
    soup = BeautifulSoup(html, "html.parser")
    img_name = f'{clean_permalink(permalink)}.png'
    if img_name not in get_current_images('players'):
        img_url = soup.find('img', class_='profile-photo')['src']
        img_path = get_image_path() / 'players' / img_name
        save_image(img_path, img_url)
        
    return {'seasons': get_years_from_html(html)}


def parse_player_row(row):
    team_images = get_current_images('teams')
    country_images = get_current_images('countries')
    permalink = row.find('a')['href'].split('/')[-1]
    links = row.find_all('a')
    name = links[1].get_text()
    team_name = links[-1]['title']
    team_code = links[-1].get_text()
    team_code_file = f'{team_code.lower()}.svg'
    if team_code_file not in team_images:
        team_img_url = f"https://www.2kratings.com/wp-content/uploads/{team_name.replace(' ', '-')}-Current-Logo.svg"
        team_code_img_path = get_image_path() / 'teams' / team_code_file
        save_image(team_code_img_path, team_img_url)
    rating = int(row.find('div', class_="rating-updated").find('span').get_text().strip())
    countries = [l for l in links if l['href'].split('/')[-2] == 'countries']
    raw_nationality = '/'.join([l.find('img')['alt'] for l in countries])
    for country in countries:
        country_code = country.find('img')['alt'].lower().replace(' ', '-')
        country_file = f'{country_code}.svg'
        if country_file not in country_images:
            country_img_url = country.find('img')['data-src']
            country_img_path = get_image_path() / 'countries' / country_file
            save_image(country_img_path, country_img_url)
    positions = [l for l in links if l['href'].split('/')[-2] == 'lists' and l['href'].split('/')[-1].find('height') == -1]
    raw_position = '/'.join([l['title'] for l in positions])
    return {
        'permalink': permalink,
        'name': name,
        'team_name': team_name,
        'team_code': team_code,
        'rating': rating,
        'raw_nationality': raw_nationality,
        'raw_position': raw_position,
        'nationality': raw_nationality.split('/')[0],
        'position': POSTION_MAP[raw_position.split('/')[0]],
    }

def get_legends(current_list, sleep=0):
    URL = 'https://www.2kratings.com/lists/top-100-all-time-players'
    permalinks = [c['permalink'] for c in current_list]
    players = []
    
    html = requests.get(URL, headers=HEADERS).text
    soup = BeautifulSoup(html, "html.parser")
    table = soup.find("table", class_="table table-striped table-sm table-hover overflow-hidden mb-0")
    for table_row in table.find_all('tr'):
        if not table_row.find('a'):
            continue
        
        player_data = parse_player_row(table_row)
        player_permalink = clean_permalink(player_data['permalink'])
        if player_permalink in permalinks:
            continue
        detailed_player_data = parse_player_page(player_data['permalink'])
        # player_data.update(detailed_player_data)
        player_data['permalink'] = player_permalink
        players.append(player_data)
        permalinks.append(player_permalink)
        time.sleep(sleep)
        print(f"completed {player_data['permalink']}")
    
    return players


def get_current(sleep=0):
    URL = 'https://www.2kratings.com/lists/top-100-highest-nba-2k-ratings'
    players = []
    
    html = requests.get(URL, headers=HEADERS).text
    soup = BeautifulSoup(html, "html.parser")
    table = soup.find("table", class_="table table-striped table-sm table-hover overflow-hidden mb-0")
    for table_row in table.find_all('tr'):
        if not table_row.find('a'):
            continue
        
        player_data = parse_player_row(table_row)
        detailed_player_data = parse_player_page(player_data['permalink'])
        player_data.update(detailed_player_data)
        players.append(player_data)
        time.sleep(sleep)
        print(f"completed {player_data['permalink']}")
    
    return players

def upsert_players(supabase, current, legends):
    for player in current:
        player['include'] = True
    
    for i, player in enumerate(legends):
        player['include'] = i < 20
    
    supabase.table('players').upsert(current + legends).execute()


def main() -> int:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    current = get_current()
    legends = get_legends(current)
    upsert_players(supabase, current, legends)

if __name__ == "__main__":
    sys.exit(main())