from http.server import HTTPServer,BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import json
import random
import time

items = ["key_office","memo_locker","memo_whiteboard","memo_Drawer","key_science_room","axe","master_key"]

Inventory = set()

TIMER_FILE = "time_save.json"

#global quiz_class 
global quiz_office
global quiz_science
    

try:
    with open("save_file.json", "r", encoding="utf-8") as f:
        json.load(f)
except (FileNotFoundError, json.JSONDecodeError):
    with open("save_file.json", "w", encoding="utf-8") as f:
        json.dump({}, f, ensure_ascii=False, indent=4)


all_room = {
        
        1:{
            "room_name":"class_room",
            "get":"key_office",
            "complete":False
            },
        2:{
            "room_name":"office",
            "get":"key_science_room",
            "complete":False
            },
        3:{
            "room_name":"science_room",
            "get":"axe",
            "complete":False
            },
        4:{
            "room_name":"exit",
            "ending":False
            }
}

class WedRequestHandler(BaseHTTPRequestHandler):
    num = 1

    def sort_hint (a):
        order_by=sorted(a,reverse=False)
        return order_by
    
    start_time = None      # 타이머 시작 시각
    paused_time = 0        # 중간 저장된 누적 시간


    def start_timer():
        """
        타이머 시작 또는 재개
        """
        global start_time
        start_time = time.time()
        print("타이머 시작")
        return start_time


    def pause_timer():
        """
        타이머를 중간 저장 (현재까지의 경과시간을 누적)
        """
        global start_time, paused_time

        if start_time is None:
            print("타이머가 아직 시작되지 않았습니다.")
            return

        elapsed = time.time() - start_time
        paused_time += elapsed
        start_time = None  # 일시정지 상태로 전환
        print(f" 타이머 중간 저장됨 (누적 시간: {paused_time:.2f}초)")


    def resume_timer():
        """
        타이머 다시 시작
        """
        global start_time
        if start_time is not None:
            print("이미 실행 중입니다")
            return
        start_time = time.time()
        print(" 타이머 재개")


    def stop_timer(user_name):
        """
        타이머 종료 후 걸린 시간 계산 및 최고기록 저장
        """
        global start_time, paused_time

        if start_time is None and paused_time == 0:
            print("타이머가 시작되지 않았습니다")
            return

        # 최종 경과 시간 계산
        total_time = paused_time
        if start_time is not None:
            total_time += time.time() - start_time

        # 시간 형식 변환
        hours = int(total_time // 3600)
        minutes = int((total_time % 3600) // 60)
        seconds = int(total_time % 60)
        formatted_time = f"{hours:02d}:{minutes:02d}:{seconds:02d}"

        # 기존 기록 불러오기
        try:
            with open(TIMER_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
        except FileNotFoundError:
            data = {}

        # 기존 기록보다 짧으면 갱신
        if user_name in data:
            prev = data[user_name]
            prev_sec = sum(int(x) * 60 ** i for i, x in enumerate(reversed(prev.split(":"))))
            if total_time < prev_sec:
                print(f"새로운 최고기록 {prev} {formatted_time}")
                data[user_name] = formatted_time
            else:
                print(f" 이번 기록: {formatted_time} (기존 기록: {prev})")
        else:
            print(f"{user_name}님의 첫 기록 저장 완료: {formatted_time}")
            data[user_name] = formatted_time

        # 저장
        with open(TIMER_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)

        # 타이머 초기화
        start_time = None
        paused_time = 0
        return formatted_time

    
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        global quiz_num
        global qize_class
        global n
        global qize_science
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("content-Type","application/json")
        self.end_headers()
        parsed=urlparse(self.path)
        query_params=parse_qs(parsed.query)
        with open("save_file.json","r")as f:
            login_data = json.load(f)
        
        
        if parsed.path  == "/save_item":
            user_item = query_params.get("item",[None])[0]
            print(user_item)
            
            if user_item in items:
                Inventory.add(user_item)
                data = str(Inventory)
            elif user_item not in items:
                data = "아이템이 아님"

            self.wfile.write (data.encode('utf-8'))
        
        if parsed.path == "/check_complete":           
            room_num = query_params["room_num"][0]
            if all_room[int(room_num)]["get"] in str(Inventory):
                all_room[int(room_num)]["complete"]="True"
                print(all_room[int(room_num)]["complete"])
                data = all_room[int(room_num)]["complete"]
                self.wfile.write (data.encode('utf-8'))
                
            else:
                data = "false"     
                self.wfile.write (data.encode('utf-8')) 
                        
        #=====================================
        if parsed.path == "/login":
            with open("save_file.json","r")as f:
                login_data=json.load(f)
            succes = False
            if query_params["id"][0] in login_data and query_params["pwd"][0] == login_data[query_params["id"][0]]["pwd"]:
                succes = True
                data = "성공"
                self.wfile.write (data.encode('utf-8'))
            else:
                data = "실패"
                self.wfile.write (data.encode('utf-8'))
                
        #======================================
        if parsed.path == "/game_save":
            with open("save_file.json","r")as f:
                login_data=json.load(f)
            room_num=3
            user_id = query_params.get("id")[0]
            print(user_id)
            save_slots = str(query_params.get("save_slots")[0])
            print(save_slots)

            login_data[user_id][save_slots]=room_num
            data = f"{save_slots}번 슬롯에 저장됨"
            self.wfile.write (data.encode('utf-8'))
            with open("save_file.json", "w")as f:
                    json.dump(login_data,f, ensure_ascii=False)
                    

        #=============================================
        if parsed.path == "/save_load":
            with open("save_file.json","r")as f:
                login_data = json.load(f)

            
            
            user_id = query_params.get("id")[0]
            save_slots= query_params.get("save_slots")[0]
            

       
            Inventory.clear()
            
            if login_data[user_id][query_params["save_slots"][0]] == 0 or 1:
                data = f"교실로 이동합니다"
                self.wfile.write (data.encode('utf-8'))
            elif login_data[user_id][query_params["save_slots"][0]] ==2:
                data = f"교무실로 이동합니다"
                self.wfile.write (data.encode('utf-8'))
            elif login_data[user_id][query_params["save_slots"][0]] == 3:
                data = f"과학실로 이동합니다"
                self.wfile.write (data.encode('utf-8'))
            elif login_data[user_id][query_params["save_slots"][0]] == 4:
                data = f"출구로 이동합니다"
                self.wfile.write (data.encode('utf-8'))
                
        
        if parsed.path == "/call_inventory":
            data = str(Inventory)
            self.wfile.write (data.encode('utf-8'))

        if parsed.path == "/make_quiz_office":
            quiz_office = random.randint(1,4)
            quiz_num = 0
            

            if quiz_office == 1:
                quiz_num = 13 + 15
                quiz_office = "13 + 15"

            elif quiz_office == 2:
                quiz_num = 13 - 15
                quiz_office = "13 - 15"    

            elif quiz_office == 3:
                quiz_num = 13 * 15
                quiz_office = "13 * 15"    

            elif quiz_office == 4:
                quiz_num = 0
                quiz_office = "13 / 15"      
            
            data = quiz_office
            self.wfile.write (data.encode('utf-8'))

        if parsed.path == "/make_quiz_class":
            global quiz_class_question
            global quiz_class_answer

            # 4개의 랜덤 숫자 생성
            quiz_class_question = [random.randint(1, 9) for _ in range(4)]

            # 정답은 복사된 리스트를 섞어서 생성
            answer_list = quiz_class_question[:] # deepcopy
            random.shuffle(answer_list)

            # 문자열 변환
            quiz_class_answer = "".join(str(num) for num in answer_list)
            data = "".join(str(num) for num in quiz_class_question)

            print("문제:", data)
            print("정답:", quiz_class_answer)

            self.wfile.write(data.encode('utf-8'))

        if parsed.path == "/make_quiz_science":
            global n
            n = random.randint(1, 20)
            
            def fibonacci_number(k): 
                if k <= 0:
                    return 0
                a, b = 1, 1
                if k == 1 or k == 2:
                    return 1
                for _ in range(3, k + 1):
                    a, b = b, a + b
                return b

            quiz_science = str(fibonacci_number(n))
            data = quiz_science
            print("과학실 문제: ", data)
            print("과학실 정답: ", n)
            self.wfile.write (data.encode('utf-8'))


        if parsed.path == "/quiz_class":

            class_answer = query_params.get("class_answer", [None])[0]
            print("사용자 입력:", class_answer)

            if quiz_class_answer == class_answer:
                data = "정답"
                self.wfile.write (data.encode('utf-8'))
            else:
                data = "오답"
                self.wfile.write (data.encode('utf-8'))

        if parsed.path == "/quiz_science":
            
            global science_answer 
            science_answer = query_params.get("science_answer", [None])[0]
            print(science_answer)
            if n == int(science_answer):
                data = "정답"
                self.wfile.write (data.encode('utf-8'))
            else:
                data = "오답"
                self.wfile.write (data.encode('utf-8'))

        if parsed.path == "/quiz_office":
            print(quiz_num)
            quiz_office_player = query_params.get("office_answer",[None])[0]
            print(quiz_office_player)

            if quiz_num == int(quiz_office_player):
                data = "정답"
                self.wfile.write (data.encode('utf-8'))
            else:
                data = "실패"
                self.wfile.write (data.encode('utf-8'))

        '''
import json
#시간 초 재기 딕셔너리 구성 예상
dict = {
    "A": "01:11:01",
    "B": "01:22:01",
    "C": "01:44:01",
    "D": "01:44:01",
    "E":"01:44:01",
    "F": "01:44:01",
    "G":"01:44:01",
    "H": "02:44:01",
    "I":"04:44:01",
    "J": "03:44:01",
    "K":"02:44:01"

}
'''
        if parsed.path =="/get_rank":
            with open("save_time.json", "r", encoding='utf-8') as f:
                dict = json.load(f)
        
        
            rank_result={

            }
            array=[]   #공동 순위가 있음을 알 수 있게 하기 위해 사용함
            rank = []
            ID=[]
            k=1
            j=0
            rp=""
            cnt=1
            # 시, 분, 초 00:01:11을 초로 변환 및 저장
            for key, value in dict.items():
                h_str, m_str, s_str = value.split(':')
                hours = int(h_str)
                minutes = int(m_str)
                seconds = int(s_str)

                total_seconds = (hours * 3600) + (minutes * 60) + seconds
                rank.append([total_seconds,1])
                array.append(total_seconds)
                ID.append(key)
            # print(f"총 초: {total_seconds}초")

            array.sort()

            #랭킹 구하기 (순위)
            for i in range(len(ID)):
                for j in range(len(ID)):
                    if rank[i][0]<rank[j][0]:
                        rank[j][1]+=1

            j=0
            while True:
                if (k>=10 or j>=10):
                    break

                for i in range(len(ID)):
                    if (k >= 10 or j>=10):
                        #print(k)
                        break

                    if (rank[i][0]==array[j]):
                        name_id=ID[i]  #그 순위에 있는 id 저장


                        if rp==array[j]:
                            rank_result[f'공동{rank[i][1]}위-{cnt}'] = {"time": dict[name_id], "id": name_id}
                            cnt+=1

                        else:
                            rank_result[f'{rank[i][1]}위']={"time":dict[name_id],"id":name_id}
                            k += 1
                            cnt=1

                        rp = array[j]
                    
                    else:
                        continue

                    j+=1

            #print(rank_result,"@@")


            with open('save_rank.json', 'w', encoding='utf-8') as f:
                json.dump(rank_result, f, ensure_ascii=False, indent=4)

            

    def do_POST(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(b"ID or password is empty")
        parsed=urlparse(self.path)


        self.data_string = self.rfile.read(int(self.headers['Content-Length'])).decode('utf-8')
        
        #========================================
        if  self.path =="/register":

            new_member = json.loads(self.data_string)
            new_id = new_member.get('id')
            new_pwd = new_member.get('pwd')
            print(new_id)
            print(new_pwd)

            
            login_data = json.load(open("save_file.json","r",encoding="utf-8"))
               
            
            if new_id not in login_data:
                login_data[new_id] = {
                    "id":new_id,
                    "pwd":new_pwd,
                    1:{"room_num":0, "time": ""},
                    2:{"room_num":0, "time": ""},
                    3:{"room_num":0, "time": ""},
                }
                data = "성공"
                self.wfile.write (data.encode('utf-8'))
                with open("save_file.json", "w", encoding="utf-8")as f:
                    json.dump(login_data,f, ensure_ascii=False)  
                    

server=HTTPServer(("0.0.0.0",8080), WedRequestHandler)
server.serve_forever()