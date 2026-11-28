
const ITEMS = [
  {
    "id": "contract",
    "type": "platform",
    "title": "계약 업무 플랫폼",
    "desc": "계약 업무의 절차와 참고 내용을 단계별로 살펴봅니다.",
    "repo": "hs-contract-manual",
    "mark": "GUIDE",
    "color": "blue",
    "tag": "업무 안내",
    "url": "https://tkooya-09.github.io/hs-contract-manual/"
  },
  {
    "id": "personal",
    "type": "platform",
    "title": "별별 개인업무 플랫폼",
    "desc": "일정, 할 일, 메모를 모아 나의 하루와 업무 기록을 관리합니다.",
    "repo": "personal-work-platform",
    "mark": "MY WORK",
    "color": "violet",
    "tag": "개인 업무",
    "url": "https://tkooya-09.github.io/personal-work-platform/"
  },
  {
    "id": "explore",
    "type": "platform",
    "title": "화성탐험대",
    "desc": "화성을 주제로 만든 탐험형 웹 프로젝트입니다.",
    "repo": "public-data-guide",
    "mark": "EXPLORE",
    "color": "teal",
    "tag": "지역 탐험",
    "url": "https://tkooya-09.github.io/public-data-guide/"
  },
  {
    "id": "tobacco",
    "type": "platform",
    "title": "담배소매인 거리검토",
    "desc": "화성특례시 담배소매인 지정업소를 검색하고 거리 검토에 활용합니다.",
    "repo": "tobacco-distance-platform-",
    "mark": "MAP",
    "color": "teal",
    "tag": "업소 검색",
    "url": "https://tkooya-09.github.io/tobacco-distance-platform-/"
  },
  {
    "id": "duty",
    "type": "platform",
    "title": "비상근무 관리 플랫폼",
    "desc": "근무 편성부터 현황 확인까지. 비상근무를 한 화면에서 관리합니다.",
    "repo": "hs-duty-manager",
    "mark": "DUTY",
    "color": "blue",
    "tag": "근무 관리",
    "url": "https://tkooya-09.github.io/hs-duty-manager/"
  },
  {
    "id": "judging",
    "type": "platform",
    "title": "AI화성 챌린지 심사집계표",
    "desc": "심사위원 점수를 모아 집계하는 심사 플랫폼입니다. 가상 데이터 견본으로 살펴보세요.",
    "repo": "ai-hwaseong-judging",
    "url": "https://ai-hwaseong-judging.vercel.app",
    "mark": "SCORE",
    "color": "violet",
    "tag": "교육용 · 샘플"
  },
  {
    "id": "data",
    "type": "platform",
    "title": "공공데이터 출처 길잡이",
    "desc": "업무에 필요한 공공데이터의 출처를 찾아보는 별별 길잡이입니다.",
    "repo": "public-data_hs",
    "mark": "DATA",
    "color": "teal",
    "tag": "공공데이터",
    "url": "https://tkooya-09.github.io/public-data_hs/"
  },
  {
    "id": "color",
    "type": "platform",
    "title": "코리요와 화성 색칠나라",
    "desc": "코리요와 함께 즐기는 색칠놀이. 일상에 작은 재미를 더합니다.",
    "repo": "hs_tacoo",
    "mark": "PLAY",
    "color": "orange",
    "tag": "놀이 · 게임",
    "url": "https://tkooya-09.github.io/hs_tacoo/"
  },
  {
    "id": "data-gs",
    "type": "platform",
    "title": "공공데이터 길잡이 · GS",
    "desc": "별별 공공데이터 출처 길잡이의 별도 버전입니다.",
    "repo": "public-data-guidegs",
    "mark": "DATA / GS",
    "color": "blue",
    "tag": "다른 버전",
    "url": "https://tkooya-09.github.io/public-data-guidegs/"
  },
  {
    "id": "data-hs",
    "type": "platform",
    "title": "공공데이터 길잡이 · HS",
    "desc": "hs-Public 저장소에서 운영하는 공공데이터 길잡이입니다.",
    "repo": "hs-Public",
    "mark": "DATA / HS",
    "color": "teal",
    "tag": "다른 버전",
    "url": "https://tkooya-09.github.io/hs-Public/"
  },
  {
    "id": "webtoon",
    "type": "webtoon",
    "title": "공무원 생존기",
    "desc": "출근길부터 사무실의 크고 작은 사건까지. AI로 그린 공무원 공감 웹툰입니다.",
    "mark": "COMICS",
    "color": "pink",
    "tag": "네이버 도전만화",
    "url": "https://comic.naver.com/challenge/list?titleId=857029"
  },
  {
    "id": "sia",
    "type": "webtoon",
    "title": "시아의 볼",
    "desc": "다섯 살 시아와 아빠의 웃음 가득한 일상. 가족의 작은 순간을 담은 성장 이야기입니다.",
    "url": "https://comic.naver.com/challenge/list?titleId=857032",
    "mark": "SIA",
    "color": "pink",
    "tag": "네이버 도전만화"
  },
  {
    "id": "frontier",
    "type": "webtoon",
    "title": "프런티어",
    "desc": "뇌칩과 스마트 렌즈, 초인공지능 ‘원’. 기술이 바꾼 세상에서 자신의 선택을 지키려는 강도윤의 이야기입니다.",
    "url": "https://comic.naver.com/challenge/list?titleId=857683",
    "mark": "FRONTIER",
    "color": "navy",
    "tag": "SF · 네이버 도전만화"
  },
  {
    "id": "overflowing-video",
    "type": "video",
    "title": "차고 넘쳐 · 아낌없이 주는 나무",
    "desc": "가족과 함께하는 일상의 행복을 담은 웹툰 가사 뮤직비디오입니다. 약 2분 38초.",
    "mark": "FAMILY",
    "color": "amber",
    "tag": "웹툰 뮤직비디오",
    "poster": "assets/video/overflowing-poster.jpg",
    "url": "https://tkooya-09.github.io/videos/overflowing/"
  },
  {
    "id": "just-you-video",
    "type": "video",
    "title": "바로 너 · 웹툰 뮤직비디오",
    "desc": "설레는 고백부터 첫 데이트까지. 노래와 웹툰 40컷으로 만나는 3분의 러브스토리.",
    "mark": "MUSIC VIDEO",
    "color": "pink",
    "tag": "3:01 · 웹툰 40컷",
    "poster": "assets/video/just-you-poster.jpg",
    "url": "https://tkooya-09.github.io/videos/just-you/"
  },
  {
    "id": "video",
    "type": "video",
    "title": "AI화성 챌린지 사전 영상",
    "desc": "AI화성 챌린지를 소개하는 영상 작업입니다.",
    "mark": "FILM",
    "color": "orange",
    "tag": "행사 영상",
    "url": "https://www.youtube.com/watch?v=H4vC5CdnoNM"
  },
  {
    "id": "just-you",
    "type": "music",
    "title": "바로 너",
    "audio": "assets/music/just-you.mp3",
    "videoPage": "https://tkooya-09.github.io/videos/just-you/",
    "desc": "",
    "mark": "MUSIC",
    "color": "pink",
    "tag": "3:01",
    "lyrics": "[1절 · 남]\n나 좋아하는 사람이 생겼어\n어떻게 고백할지 들어 봐\n웃을 때 예쁘고 너랑 참 닮았어\n왜 자꾸 웃어? 벌써 알겠어?\n\n[1절 · 여]\n내가 좋아하는 꽃을 들고\n왜 다른 사람 얘기를 하는데?\n빙빙 돌리지 말고 나를 봐\n듣고 싶은 말이 있단 말이야\n\n[프리 코러스]\n[남] 눈치챘어?\n[여] 아까부터!\n[남] 너의 대답은?\n[여] 고백부터!\n[함께] 한 발 가까이 다가가\n하나, 둘, 셋!\n\n[코러스 · 함께]\n너 너 너, 바로 너!\n내가 좋아하는 사람 너!\n또 또 또, 웃잖아!\n너만 보면 내가 이렇잖아!\n\n[남] 좋아해도 돼?\n[여] 돼 돼 돼!\n[여] 내 손 잡을래?\n[남] 네 네 네!\n[함께] 빙빙 돌리지 말고 딱 말해\n너를 너를 너를 좋아해!\n\n[간주 · 8마디]\n\n[2절 · 여]\n잘 자라고 해 놓고 아쉬워\n괜히 또 “뭐 해?”라고 보냈어\n\n[2절 · 남]\n나도 네 답장을 기다리다가\n쓰다 지운 말이 “보고 싶어”\n\n[여] 나만 설렌 줄 알았잖아\n[남] 나도 혼자인 줄 알았잖아\n[함께] 이제 눈치 보지 않을래\n좋아한다 말해 줄래\n\n[코러스 · 함께]\n너 너 너, 바로 너!\n내가 좋아하는 사람 너!\n또 또 또, 웃잖아!\n너만 보면 내가 이렇잖아!\n\n[남] 좋아해도 돼?\n[여] 돼 돼 돼!\n[여] 내 손 잡을래?\n[남] 네 네 네!\n[함께] 빙빙 돌리지 말고 딱 말해\n너를 너를 너를 좋아해!\n\n[브리지]\n[남] 오늘은 집에 조금 늦게 갈까?\n[여] 저기 모퉁이까지만 더 걷자\n[함께] 늘 걷던 길도 너와 손잡으니\n처음 걷는 것처럼 설레잖아\n\n[마지막 후렴 · 함께]\n너 너 너, 좋아해!\n어제보다 오늘 더 좋아해!\n또 또 또, 말할래!\n내일도 네 옆에서 웃을래!\n\n좋아 좋아, 네가 좋아\n자꾸자꾸 네가 좋아\n너도 나도 같은 마음\n오늘부터 우리 둘이야!\n\n[아웃트로 · 함께]\n너 너 너, 바로 너!\n처음부터 내 사랑은 너!"
  },
  {
    "id": "as-you-think",
    "type": "music",
    "title": "생각하는 대로",
    "audio": "assets/music/as-you-think.mp3",
    "desc": "",
    "mark": "MUSIC",
    "color": "violet",
    "tag": "4:40",
    "lyrics": "[후렴]\n생각하는 대로, 대로, 대로 내 마음이 가는 대로, 대로 잘될 거야, 잘될 거야 오늘도 내게 말해 주는 거야\n웃는 대로, 걷는 대로 조금씩 나아지는 거야 인생 뭐 별거 있나 한 번 더 해 보는 거야!\n\n[1절]\n눈을 뜨자마자 한숨부터 쉬면 좋은 아침도 괜히 무거워 거울 속의 나에게 웃어 줬더니 오늘은 왠지 좀 괜찮겠어\n안 될 거란 말은 잠깐 접어 두고 될 수 있는 것부터 해 보는 거야 생각 하나 바꿨을 뿐인데 멈춰 있던 발이 움직이잖아\n\n[프리코러스]\n생각이 말을 만들고 그 말이 나를 움직여 그렇게 내딛는 한 걸음이 내일의 나를 만드는 거야\n\n[후렴]\n생각하는 대로, 대로, 대로 내 마음이 가는 대로, 대로 잘될 거야, 잘될 거야 오늘도 내게 말해 주는 거야\n웃는 대로, 걷는 대로 조금씩 나아지는 거야 인생 뭐 별거 있나 한 번 더 해 보는 거야!\n\n[포스트코러스 · 함께 따라 부르기]\n생각대로! 일단 해 봐! 안 풀려도! 다시 해 봐! 잘될 거야! 잘될 거야! 내 편은 내가 돼 주는 거야!\n\n[2절]\n옆집 누가 나보다 잘나간대도 내 하루까지 작아지진 않아 남의 속도 따라 숨차게 뛰다가 내 행복을 지나치진 말자\n생각이 바르면 행동도 바르게 작은 약속 하나라도 지켜 가 아무도 안 보는 곳에서의 내가 결국 내 인생을 만드는 거야\n\n[프리코러스]\n기분은 흐릴 수 있어도 마음까지 닫지는 말자 오늘을 대하는 내 태도가 내일의 문을 두드리잖아\n\n[후렴]\n생각하는 대로, 대로, 대로 내 마음이 가는 대로, 대로 잘될 거야, 잘될 거야 오늘도 내게 말해 주는 거야\n웃는 대로, 걷는 대로 조금씩 나아지는 거야 인생 뭐 별거 있나 한 번 더 해 보는 거야!\n\n[브리지 · 잠깐 잔잔하게]\n물론 내 맘대로 안 되는 날도 있지 웃어 보려 해도 눈물이 나겠지 그럴 땐 잠깐 쉬었다 가면 돼 하루 좀 힘들었다고 끝난 건 아니야\n세상이 내 뜻대로 돌아가진 않아도 다음 걸음은 내가 고르는 거야 괜찮아, 아직 끝이 아니야 자, 다시 가는 거야!\n\n[마지막 후렴 · 더 크게]\n생각하는 대로, 대로, 대로 좋은 날을 향해 가는 거야 잘될 거야, 잘될 거야 말만 말고 한 발 내딛는 거야\n넘어져도, 돌아가도 내 인생은 계속되는 거야 인생 뭐 별거 있나 웃으면서 살아 보는 거야!\n\n[아웃트로 · 반복]\n생각대로! 일단 해 봐! 안 풀려도! 다시 해 봐! 잘될 거야! 잘될 거야! 오늘도 나를 믿어 보는 거야!\n인생은 말이야— 생각부터 웃는 거야!"
  },
  {
    "id": "merry-merry-christmas",
    "type": "music",
    "title": "메리 메리 크리스마스",
    "audio": "assets/music/merry-merry-christmas.mp3",
    "desc": "",
    "mark": "MUSIC",
    "color": "violet",
    "tag": "3:00",
    "lyrics": "[Intro]\n메리 메리 크리스마스!\nHey! Hey! Merry Christmas!\n\n[Intro]\n메리 메리 크리스마스!\nHey! Hey! Merry Christmas!\n\n[Verse 1]\n빨간 목도리 두르고 문을 나서면\n하얀 입김 사이로 웃음이 번져\n장갑 낀 네 손 내 손 꼭 맞잡고서\n종이별 달린 골목 함께 걸어가\n\n[Pre-Chorus]\n하나 둘 셋, 마음을 모아\n오늘 밤은 더 가까이\n작은 선물 같은 이 순간\n우리 함께 외쳐 봐\n\n[Chorus]\n메리 메리 크리스마스! (메리 메리 크리스마스!)\n온 세상에 웃음꽃 피어나\nHey! Hey! Merry Christmas! (Hey! Hey! Merry Christmas!)\n너와 나, 다 같이 춤춰 봐\n메리 메리 크리스마스!\n사랑을 나눠, 손을 잡아\nHey! Hey! Merry Christmas!\n오늘 밤은 우리들의 파티야\n\n[Verse 2]\n접시 위 쿠키 하나 반씩 나누고\n서툰 카드 한 장에 마음을 적어\n친구들 모인 식탁 노래가 번져\n창문 너머 겨울도 따뜻해 보여\n\n[Pre-Chorus]\n하나 둘 셋, 더 크게 불러\n기다렸던 이 순간\n네 옆에서 맞는 오늘이\n제일 좋은 선물이야\n\n[Chorus]\n메리 메리 크리스마스! (메리 메리 크리스마스!)\n온 세상에 웃음꽃 피어나\nHey! Hey! Merry Christmas! (Hey! Hey! Merry Christmas!)\n너와 나, 다 같이 춤춰 봐\n메리 메리 크리스마스!\n사랑을 나눠, 손을 잡아\nHey! Hey! Merry Christmas!\n오늘 밤은 우리들의 파티야\n\n[Bridge]\n잠깐만, 귀 기울여 봐\n네가 곁에 있어 참 좋아\n작은 마음 하나씩 모으면\n겨울밤도 포근해져\n자, 다 같이 준비됐지?\n\n[Final Chorus]\n메리 메리 크리스마스! (메리 메리 크리스마스!)\n온 세상에 웃음꽃 피어나\nHey! Hey! Merry Christmas! (Hey! Hey! Merry Christmas!)\n가족 친구 모두 춤춰 봐\n메리 메리 크리스마스!\n사랑을 나눠, 손을 잡아\nHey! Hey! Merry Christmas!\n오늘 밤은 우리들의 파티야\n\n[Outro]\n메리 메리 크리스마스!\nHey! Hey! Merry Christmas!\n모두 함께, 메리 크리스마스!"
  },
  {
    "id": "overflowing",
    "type": "music",
    "title": "차고 넘쳐",
    "audio": "assets/music/overflowing.mp3?v=6f176bdb26ed",
    "videoPage": "https://tkooya-09.github.io/videos/overflowing/",
    "desc": "",
    "mark": "MUSIC",
    "color": "violet",
    "tag": "2:09",
    "lyrics": "[1절]\n나는 지금 너무 행복해\n모든 게 차고 넘치고 있어\n내 행복의 그릇이\n이렇게 작을 줄 몰랐어\n사랑하는 가족이 있고\n아침이면 갈 곳이 있어\n하루 끝에 돌아오면\n나를 반겨 주는 네가 있어\n\n[후렴]\n이만하면 행복해\n이만하면 충분해\n너희 곁에 있는 지금\n더 바라는 게 없어\n아낌없이 주는 나무\n그런 내가 되고 싶어\n너희가 내 그늘 아래\n편히 쉬면 좋겠어\n\n[2절]\n예전에는 몰랐었지\n행복은 멀리 있는 줄\n조금 더 가지게 되면\n그때야 웃게 되는 줄\n함께 앉아 밥을 먹고\n오늘 하루를 얘기하고\n별것 아닌 말 한마디에\n같이 웃는 게 행복이야\n\n[후렴]\n이만하면 행복해\n이만하면 충분해\n너희 곁에 있는 지금\n더 바라는 게 없어\n아낌없이 주는 나무\n그런 내가 되고 싶어\n너희가 내 그늘 아래\n편히 쉬면 좋겠어\n\n[아웃트로]\n내가 주는 것보다\n받는 사랑이 더 많아\n나는 지금 너무 행복해\n너희가 있어서 행복해"
  },
  {
    "id": "ganadara",
    "type": "music",
    "title": "가나다라 대한민국",
    "audio": "assets/music/ganadara.mp3",
    "desc": "",
    "mark": "MUSIC",
    "color": "violet",
    "tag": "1:00",
    "lyrics": "[Intro — Group Shout]\n가나다라, 대한민국!\n[Verse 1 — Fast Rap]\n가! 가야금 튕겨, 천년의 울림으로 판을 열어\n나! 나라 이름 가슴에, 넘어져도 다시 일어서\n다! 다 함께 손을 들어, 우리 꿈을 세계로 펼쳐\n라! 라면처럼 뜨거워, 식지 않는 열정을 외쳐\n마! 마당놀이 한판, 온 세상이 우리의 무대\n바! 바다 너머 돛을 올려, 더 큰 내일 향해 출발해\n사! 사물놀이 쿵덕쿵, 우리 심장 소리 울려라!\n[Chorus — Powerful Crowd Chant]\n가나다라! 올라가!\n마바사아! 더 높이 가!\n자차카타! 멈추지 마!\n파하! 하나 되어 달려가!\n[Verse 2 — Fast Rap]\n아! 아리랑 고개 넘어, 세대를 이어 온 노래\n자! 자주독립 지켜 낸 이름, 가슴 깊이 새길게\n차! 차세대의 꿈을 펼쳐, 우리가 만드는 미래\n카! 카운트다운 삼 이 일, 저 하늘로 날아올라\n타! 타오르는 눈빛으로, 어둠을 뚫고 일어서\n파! 파도처럼 번져 가, 우리 리듬 바다를 건너\n하! 하나 되어 외쳐라, 너와 내가 빛낼 대한민국!"
  },
  {
    "id": "grow",
    "type": "music",
    "title": "천천히 자라도 돼",
    "audio": "assets/music/grow.mp3",
    "desc": "",
    "mark": "MUSIC",
    "color": "violet",
    "tag": "2:32",
    "lyrics": "[Verse 1]\n작은 손이 내 손가락을 꼭 잡던 날\n너는 다섯 살, 내 주머니엔 작은 사탕\n퇴근 문 열리면 양말도 벗기 전에\n달려와 안기던 네 웃음, 오늘도 선명해\n저녁 밥풀 묻은 볼을 닦아 주고\n잠든 네 얼굴을 한참 바라보네\n오늘은 내가 더 서툴렀던 것 같아\n내일은 같이 조금 배워 보자\n[Pre-Chorus]\n잘하지 않아도 괜찮아\n너라서 나는 사랑하니까\n[Chorus]\n천천히 자라도 돼\n천천히 가도 괜찮아\n힘든 날 씩씩한 척 말고\n아빠는 네 편이야\n[Verse 2]\n언젠가 네가 친구를 먼저 찾고\n내 얘긴 짧게 웃고 지나가도\n네 방문 너머로 네 세상이 자라\n혼자 고른 길을 걸어가겠지\n조금 서운해도 네 마음을 믿을게\n네가 고른 삶을 살아도 괜찮아\n나는 늘 정답을 아는 아빠는 아니야\n넘어진 날엔 너와 함께 배워 갈게\n[Chorus]\n천천히 자라도 돼\n천천히 가도 괜찮아\n힘든 날 씩씩한 척 말고\n아빠는 네 편이야\n[Bridge]\n네가 말없이 앉아 있어도 돼\n내 앞에선 괜찮은 얼굴 안 해도 돼\n잘한 일보다 네가 온 오늘이 좋아\n대답 대신 손을 내밀어 둘게\n[Final Chorus]\n천천히 자라도 돼\n네 걸음을 믿고 기다릴게\n네가 고른 길 어디라도\n아빠는 네 편이야\n천천히 자라도 돼\n난 한 걸음 뒤에 있을게\n웃다가 울어도 괜찮아\n사랑한다, 우리 딸"
  },
  {
    "id": "thank-you",
    "type": "music",
    "title": "여보야 고마워",
    "audio": "assets/music/thank-you.mp3",
    "desc": "",
    "mark": "MUSIC",
    "color": "violet",
    "tag": "3:00",
    "lyrics": "[Verse 1: 남편]\n아침에 네가 먼저 챙긴 따뜻한 물 한 잔\n내가 찾던 열쇠는 네가 또 찾아놨네\n아이 도시락 옆에 적힌 작은 웃는 얼굴\n정신없는 하루도 그걸 보면 괜찮아\n[Verse 2: 아내]\n퇴근길에 네가 사 온 귤 한 봉지\n내가 좋아하는 건 참 잘도 기억해\n아이 숙제 봐주다 둘 다 졸았던 밤\n당신이 이불 덮어줘서 포근했어\n[Call and Response]\n남편: 오늘도 고생 많았지?\n아내: 당신도 참 수고했어\n남편: 내가 설거지할게\n아내: 그럼 난 옆에서 감독할게\n[Chorus: 함께]\n여보야 고마워, 내 편이 되어줘서\n여보야 사랑해, 매일 웃게 해줘서\n별일 없는 하루가 참 좋은 이유\n당신과 나, 우리라서 그래\n여보야 고마워, 여보야 사랑해\n[Verse 3: 남편]\n아이 재우고 나면 소파 한쪽 나눠 앉아\n오늘 있었던 일을 천천히 꺼내놓지\n내 얘기 끝까지 들어주는 그 표정에\n나는 또 내일도 잘해보고 싶어져\n[Verse 4: 아내]\n가끔은 양말 한 짝 소파 밑에 숨고\n누가 마지막 과자를 먹었나 실랑이해\n그래도 당신 웃음 먼저 터지면\n나도 못 이긴 척 같이 웃게 돼\n[Chorus: 함께]\n여보야 고마워, 내 편이 되어줘서\n여보야 사랑해, 매일 웃게 해줘서\n별일 없는 하루가 참 좋은 이유\n당신과 나, 우리라서 그래\n여보야 고마워, 여보야 사랑해\n[Harmonica Interlude]\n[Bridge: 함께]\n아이 손 잡고 걷는 길, 둘이 나눈 눈빛\n서툰 날도 좋은 날도 함께 건너왔네\n큰말 하지 않아도 마음은 다 아니까\n오늘도 당신 곁에 꼭 붙어 있을게\n[Final Chorus: 함께]\n여보야 고마워, 내 편이 되어줘서\n여보야 사랑해, 매일 웃게 해줘서\n별일 없는 하루가 참 좋은 이유\n당신과 나, 우리라서 그래\n여보야 고마워, 여보야 사랑해\n여보야 고마워, 오래오래 사랑해\n[Spoken Outro: 남편]\n여보, 오늘도 고마워.\n[Spoken Outro: 아내]\n나도 고마워. 내일은 당신이 귤 까줘.\n[Spoken Outro: 남편]\n좋아. 대신 양말은 제자리에 둘게.\n[Spoken Outro: 아내]\n약속이야. 사랑해."
  },
  {
    "id": "life",
    "type": "music",
    "title": "인생 별거 없더라",
    "audio": "assets/music/life.mp3",
    "desc": "",
    "mark": "MUSIC",
    "color": "violet",
    "tag": "3:30",
    "lyrics": "[Intro]\n[Acoustic guitar]\n[Verse 1: Male]\n퇴근길 봉지엔 두부 한 모\n당신은 귤 두 개 골랐네\n오늘은 어땠냐 묻는 말에\n그냥 그랬지, 웃으며 말하네\n[Verse 1: Female]\n싱크대 옆에 컵 두 개\n한쪽엔 당신 커피 자국\n별일 없던 하루 끝에서\n당신 얼굴 보니 괜찮아\n[Spoken: Female]\n당신도요. 내일도 같이 밥 먹어요.\n[Both: Softly]\n우리 이렇게 오래오래 웃어요\n[Male] 대단한 일 없어도\n[Female] 나란히 앉아 있으면\n[Both] 하루가 제자릴 찾네\n[Chorus: Both]\n인생 별거 없더라, 당신 손 잡고\n식은 밥 데워 먹고 안부를 나누면\n세상 별거 없더라, 당신 곁에서\n작은 웃음 하나면 오늘도 충분해\n[Verse 2: Female]\n창문에 비가 톡톡 내려\n빨래는 내일 널면 되지\n당신이 접시를 씻는 동안\n나는 내일 반찬을 고르네\n[Spoken: Male]\n오늘도 수고했어.\n[Verse 2: Male]\n양말 한 짝 어디 갔냐고\n또 서로 모른 척 웃다가\n버스 놓친 얘길 꺼내면\n당신은 꼭 내 편을 드네\n[Pre-Chorus: Call and Response]\n[Female] 조금 서툰 하루도\n[Male] 같이 나누고 나면\n[Both] 괜히 가벼워지네\n[Chorus: Both]\n인생 별거 없더라, 당신 손 잡고\n당신은 꼭 내 편을 드네\n[Pre-Chorus: Call and Response]\n[Female] 조금 서툰 하루도\n[Male] 같이 나누고 나면\n[Both] 괜히 가벼워지네\n[Chorus: Both]\n인생 별거 없더라, 당신 손 잡고\n식은 밥 데워 먹고 안부를 나누면\n세상 별거 없더라, 당신 곁에서\n작은 웃음 하나면 오늘도 충분해\n[Spoken: Male]\n오늘도 수고했어.\n[Spoken: Female]\n당신도요. 내일도 같이 밥 먹어요.\n[Both: Softly]\n우리 이렇게 오래오래 웃어요\n[Spoken: Female]\n당신도요. 내일도 같이 밥 먹어요.\n[Male] 먼 훗날에도 이 저녁처럼\n[Female] 별일 없는 날을 아껴요\n[Male] 주름이 조금 더 늘어나도\n[Female] 당신 얘긴 또 듣고 싶어요\n[Final Chorus: Both]\n인생 별거 없더라, 당신 손 잡고\n늦은 밥 함께 먹고 꿈 얘길 나누면\n세상 별거 없더라, 당신 곁에서\n작은 웃음 하나면 내일도 충분해\n인생 별거 없더라, 참 고마운 사람\n하루하루 함께라서 마음이 놓여\n[Spoken: Male]\n오늘도 수고했어.\n[Spoken: Female]\n당신도요. 내일도 같이 밥 먹어요.\n[Both: Softly]\n우리 이렇게 오래오래 웃어요"
  },
  {
    "id": "what-is-life",
    "type": "music",
    "title": "인생 뭐 있나",
    "audio": "assets/music/what-is-life.mp3",
    "desc": "",
    "mark": "MUSIC",
    "color": "violet",
    "tag": "4:04",
    "lyrics": "[Intro: Male]\n오늘도 참 많이 버텼지\n말없이 삼킨 날들이 길었지\n[Verse 1: Female]\n괜찮은 척 웃으며 넘긴 저녁\n괜찮은 척 웃으며 넘긴 저녁\n식은 국 한 숟갈에 하루를 접고\n잘한 일보다 못한 일만 세다가\n거울 속 내 얼굴을 오래 바라봐\n[Verse 2: Male]\n어깨 위엔 아직 할 일이 남았고\n마음 한쪽엔 못다 한 꿈이 있어\n그래도 여기까지 걸어온 발자국\n누구보다 네가 잘 알고 있잖아\n[Pre-Chorus: Female]\n늦었다고 말하지 마\n네 시간은 네 속도로 가\n[Chorus: Duet]\n인생 별거 없더라, 오늘을 건너면 돼\n인생 별거 없더라, 오늘을 건너면 돼\n대단한 답을 몰라도 서로 곁에 있으면 돼\n잘 살아왔다고, 이제는 말해줘\n마흔다섯의 너에게도 봄은 다시 와\n인생 별거 없더라, 한숨 놓아도 돼\n넘어진 날보다 일어난 날이 더 많았잖아\n내일이 조금 낯설어도 괜찮아\n우리 아직 괜찮아, 여기까지 잘 왔어\n[Verse 3: Male]\n아이들 자란 키를 문틀에 적고\n부모님 목소린 안부로 남고\n내 이름보다 누군가의 역할로\n살아온 날들도 헛된 건 아니야\n[Verse 4: Female]\n놓친 것만 세면 마음이 아프니\n지킨 것들을 오늘 하나 떠올려\n따뜻한 밥 한 끼, 오래된 친구\n네가 건넨 친절도 누군가 기억해\n[Pre-Chorus: Male]\n늦었다고 말하지 마\n네 시간은 네 속도로 가\n[Chorus: Duet]\n인생 별거 없더라, 오늘을 건너면 돼\n대단한 답을 몰라도 서로 곁에 있으면 돼\n잘 살아왔다고, 이제는 말해줘\n마흔다섯의 너에게도 봄은 다시 와\n인생 별거 없더라, 한숨 놓아도 돼\n넘어진 날보다 일어난 날이 더 많았잖아\n내일이 조금 낯설어도 괜찮아\n우리 아직 괜찮아, 여기까지 잘 왔어\n[Bridge: Female]\n너는 늦은 게 아니야\n[Bridge: Male]\n나는 혼자가 아니야\n[Bridge: Duet]\n잠깐 쉬어 가도 돼\n서로의 손을 놓지 마\n[Final Chorus: Duet with Choir]\n인생 별거 없더라, 오늘을 건너면 돼\n대단한 답을 몰라도 서로 곁에 있으면 돼\n잘 살아왔다고, 크게 말해줘\n마흔다섯의 너에게도 봄은 다시 와\n인생 별거 없더라, 한숨 놓아도 돼\n넘어진 날보다 일어난 날이 더 많았잖아\n내일이 조금 낯설어도 괜찮아\n우리 아직 괜찮아, 여기까지 잘 왔어\n[Outro: Duet]\n여기까지 잘 왔어\n우리 아직 괜찮아"
  }
];
const labels={all:'전체',platform:'플랫폼',webtoon:'웹툰',video:'영상',music:'음악',favorites:'즐겨찾기',guestbook:'방명록'};
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeURL=s=>{try{const u=new URL(s);return u.protocol==='https:'?u.href:''}catch{return ''}};
let favorites=new Set();try{const data=JSON.parse(localStorage.getItem('mk-studio-favorites')||'[]');if(Array.isArray(data))favorites=new Set(data.filter(x=>typeof x==='string'))}catch{}

const STUDIO_ENDPOINT='https://sbnjodqxvwgqgdnzcziz.supabase.co/functions/v1/studio-guestbook';
let viewCounts=Object.create(null), viewsReady=false, activeVisitor=null;
const trackedViews=new Set(), pendingViews=new Set();
function visitorIdentity(){
 const key='studio-visit-'+new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Seoul'}).format(new Date());
 if(activeVisitor?.key===key)return activeVisitor;
 let visitor=crypto.randomUUID();
 try {
  const previous=JSON.parse(localStorage.getItem('studio-visitor')||'null');
  if(previous?.key===key && typeof previous.visitor==='string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(previous.visitor))visitor=previous.visitor;
  localStorage.setItem('studio-visitor',JSON.stringify({key,visitor}));
 } catch {}
 activeVisitor={key,visitor};
 return activeVisitor;
}
function displayCount(n){return Number.isSafeInteger(n)&&n>=0?n.toLocaleString('ko-KR'):'—'}
function applyMetrics(data,reorder=false){
 if(Number.isSafeInteger(data.today)&&Number.isSafeInteger(data.total)){
  $('visit-today').textContent=displayCount(data.today);
  $('visit-total').textContent=displayCount(data.total);
  $('visit-count').textContent='오늘 방문 '+displayCount(data.today)+' · 누적 방문 '+displayCount(data.total);
  $('visit-summary-note').textContent='같은 브라우저의 방문은 하루 한 번 집계합니다.';
 }
 if(!data.views||typeof data.views!=='object'||Array.isArray(data.views))return;
 for(const item of ITEMS){
  const value=data.views[item.id];
  if(Number.isSafeInteger(value)&&value>=0)viewCounts[item.id]=Math.max(viewCounts[item.id]||0,value);
 }
 viewsReady=true;
 if(reorder)render();
 else document.querySelectorAll('[data-view-count]').forEach(el=>{
  el.textContent='조회 '+displayCount(viewCounts[el.dataset.viewCount]||0);
 });
}
async function trackWorkView(id){
 if(!ITEMS.some(item=>item.id===id))return;
 const identity=visitorIdentity(),key=identity.key+':'+id;
 if(trackedViews.has(key)||pendingViews.has(key))return;
 pendingViews.add(key);
 try {
  const res=await fetch(STUDIO_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'view',visitor:identity.visitor,work:id}),keepalive:true,signal:AbortSignal.timeout(10000)});
  if(!res.ok)return;
  const data=await res.json();
  if(data.error)return;
  trackedViews.add(key);
  // Update numbers without moving the card currently being opened.
  applyMetrics(data);
 } catch {} finally {pendingViews.delete(key)}
}

const hashCategory=()=>location.hash==='#guestbook'?'guestbook':location.hash==='#video'?'video':'all';
let current=hashCategory();let timer;
function notify(s){$('notice').textContent=s;clearTimeout(timer);timer=setTimeout(()=>$('notice').textContent='',3500)}
function card(it){const url=safeURL(it.url),repo=it.repo?'https://github.com/tkooya-09/'+encodeURIComponent(it.repo):'';return `<article class="card" data-work-card="${esc(it.id)}"><div class="cover ${esc(it.color||'blue')}">${it.poster?`<img class="video-poster" src="${esc(it.poster)}" alt="" loading="lazy" width="1280" height="720">`:""}<div class="cover-word" aria-hidden="true"><small>${it.type==='platform'?'CREATIVE TOOLS':it.type==='webtoon'?'VISUAL STORIES':it.type==='music'?'ORIGINAL MUSIC':'MOTION & STORY'}</small>${esc(it.mark||'PROJECT')}</div><div class="mini" aria-hidden="true"><i></i><i></i><i></i></div><button class="fav" data-fav="${esc(it.id)}" aria-label="${esc(it.title)} 즐겨찾기" aria-pressed="${favorites.has(it.id)}">${favorites.has(it.id)?'★':'☆'}</button></div><div class="card-body"><div class="tags"><span class="pill">${labels[it.type]}</span><span class="tag">${esc(it.tag||'프로젝트')}</span><span class="view-count" data-view-count="${esc(it.id)}" title="작업실에서 열기·재생한 횟수, 같은 브라우저는 작품별 하루 1회">조회 ${viewsReady?displayCount(viewCounts[it.id]||0):'—'}</span></div><h3>${it.audio ? `<button type="button" class="song-select" data-song="${esc(it.id)}" aria-label="${esc(it.title)} 재생 및 가사 보기"><span>${esc(it.title)}</span><span class="song-play" aria-hidden="true">▶ 재생 · 가사</span></button>` : esc(it.title)}</h3><p class="desc">${esc(it.desc)}</p>${it.episodes?`<details><summary>등록된 회차 ${it.episodes.length}편</summary><ol>${it.episodes.map(e=>`<li>${esc(e)}</li>`).join('')}</ol><p>회차별 공개 주소 연결 준비 중</p></details>`:''}<div class="actions">${it.audio?(it.videoPage?`<a class="action" data-work="${esc(it.id)}-video" href="${esc(safeURL(it.videoPage))}">▶ 뮤직비디오 보기</a>`:''):url?`<a class="action" data-work="${esc(it.id)}" href="${esc(url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(it.title)} 새 창에서 열기">${it.type==='video'?'영상 보기':it.type==='webtoon'?'작품 보기':'바로 열기'}</a>`:`<span class="pending">${repo?'배포 주소 미등록':'공개 링크 준비 중'}</span>`}${repo?`<a class="source" href="${esc(repo)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(it.title)} GitHub 저장소">GitHub</a>`:''}</div></div></article>`}
function render(){
const isGuestbook=current==='guestbook';
$('guestbook').hidden=!isGuestbook;
$('catalog-content').hidden=isGuestbook;
$('catalog-inputs').hidden=isGuestbook;
$('guest-intro').hidden=!isGuestbook;
$('collection-title').textContent=isGuestbook?'방명록':'작품 모아보기';
document.querySelectorAll('.nav a[href="#collection"],.nav a[href="#guestbook"]').forEach(link=>{
if((link.hash==='#guestbook')===isGuestbook)link.setAttribute('aria-current','page');
else link.removeAttribute('aria-current');
});
const q=$('search').value.trim().toLowerCase();let list=ITEMS.filter(it=>(current==='all'||current==='favorites'&&favorites.has(it.id)||it.type===current)&&[it.title,it.desc,it.repo,it.tag,...(it.episodes||[])].join(' ').toLowerCase().includes(q));if($('sort').value==='popular')list.sort((a,b)=>(viewCounts[b.id]||0)-(viewCounts[a.id]||0));if($('sort').value==='title')list.sort((a,b)=>a.title.localeCompare(b.title,'ko'));if($('sort').value==='linked')list.sort((a,b)=>Number(!!b.url)-Number(!!a.url));$('grid').innerHTML=list.length?list.map(card).join(''):`<div class="empty"><strong>${current==='favorites'?'아직 저장한 작품이 없습니다':'검색 결과가 없습니다'}</strong><p>${current==='favorites'?'작품 카드의 별을 눌러 자주 찾는 작품을 모아보세요.':'다른 검색어나 분류로 다시 찾아보세요.'}</p><button id="reset">전체 작품 보기</button></div>`;$('results').textContent=q ? `검색 결과 ${list.length}개` : current==='favorites' ? '이 브라우저에 저장한 작품입니다.' : '';const counts=Object.fromEntries(Object.keys(labels).map(type=>[type,type==='all'?ITEMS.length:type==='favorites'?ITEMS.filter(item=>favorites.has(item.id)).length:ITEMS.filter(item=>item.type===type).length]));
document.querySelectorAll('[data-type]').forEach(b=>{let t=b.dataset.type,n=counts[t];b.innerHTML=labels[t]+(t==='guestbook'?'':`<span class="num">${n}</span>`);b.classList.toggle('on',t===current);b.setAttribute('aria-pressed',String(t===current))})}
document.addEventListener('click',e=>{const t=e.target.closest('[data-type]');if(t){current=t.dataset.type;history.replaceState(null,'',current==='guestbook'?'#guestbook':current==='video'?'#video':'#collection');render()}const f=e.target.closest('[data-fav]');if(f){const id=f.dataset.fav;if(favorites.has(id))favorites.delete(id);else favorites.add(id);try{localStorage.setItem('mk-studio-favorites',JSON.stringify([...favorites]))}catch{notify('저장 공간을 사용할 수 없어 이번 화면에서만 유지됩니다.')}render();document.querySelector(`[data-fav="${CSS.escape(id)}"]`)?.focus()}if(e.target.id==='reset'){current='all';$('search').value='';render();$('search').focus()}});$('search').addEventListener('input',render);$('sort').addEventListener('change',render);
document.addEventListener('click',event=>{
const link=event.target.closest('a[href="#guestbook"],a[href="#collection"]');
if(!link)return;
event.preventDefault();
current=link.hash==='#guestbook'?'guestbook':'all';
history.pushState(null,'',link.hash);
render();
$('collection').scrollIntoView({block:'start'});
document.querySelector('[data-type="'+current+'"]').focus({preventScroll:true});
});
window.addEventListener('hashchange',()=>{
current=hashCategory();
render();
});
function trackWorkLink(event){
 const link=event.target.closest('a[data-work]');
 if(!link||event.defaultPrevented||(event.type==='auxclick'&&event.button!==1))return;
 void trackWorkView(link.dataset.work);
}
document.addEventListener('click',trackWorkLink);
document.addEventListener('auxclick',trackWorkLink);
$('audio').addEventListener('playing',()=>{
 const id=$('audio').dataset.work;
 if(id)void trackWorkView(id);
});
// Only explicitly registered projects are published.
document.addEventListener('click', async event => {
  const button = event.target.closest('[data-song]');
  if (!button) return;
  const song = ITEMS.find(item => item.id === button.dataset.song);
  const player = $('audio');
  $('song-player').hidden = false;
  $('song-title').textContent = song.title;
  $('song-lyrics').textContent = song.lyrics;
  $('lyrics-panel').open = true;
  $('song-player').scrollIntoView({block: 'start'});
  player.dataset.work = song.id;
  player.src = song.audio;
  try { await player.play(); }
  catch (error) { if (error.name !== 'AbortError') notify('재생할 수 없습니다. 다시 시도해 주세요.'); }
});
render();

;

(() => {
 const endpoint=STUDIO_ENDPOINT;
 const form=document.getElementById('guest-form');
 const status=document.getElementById('guest-status');
 let latest=0;
 async function request(action,fields={}) {
   const sequence=++latest;
   const res=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,visitor:visitorIdentity().visitor,...fields}),signal:AbortSignal.timeout(20000)});
   if(!res.ok) throw new Error(res.status===429?'잠시 후 다시 남겨 주세요.':'연결하지 못했어요. 잠시 후 다시 시도해 주세요.');
   const data=await res.json();
   if(sequence!==latest)return;
   applyMetrics(data,true);
   const list=document.getElementById('guest-list');
   list.replaceChildren(...data.notes.map(entry=>{
     const row=document.createElement('li'),name=document.createElement('strong'),time=document.createElement('time'),message=document.createElement('p');
     name.textContent=entry.name; time.dateTime=entry.created;
     time.textContent=new Date(entry.created).toLocaleDateString('ko-KR',{timeZone:'Asia/Seoul'});
     message.textContent=entry.message;row.append(name,time,message);return row;
   }));
   status.textContent=action==='post'?'방명록에 남겼어요.':data.notes.length?'':'첫 번째 한마디를 남겨 주세요.';
 }
 const onError=err=>{status.textContent=err.name==='TimeoutError'?'연결이 지연되고 있어요. 다시 시도해 주세요.':err.message;};
 request('visit').catch(err=>{
  onError(err);
  $('visit-summary-note').textContent='방문 현황을 불러오지 못했습니다. 새로고침하면 다시 확인합니다.';
 });
 form.addEventListener('submit',async event=>{
   event.preventDefault();
   const button=form.querySelector('button');if(button.disabled)return;
   const nickname=form.elements.nickname.value.trim(),note=form.elements.message.value.trim();
   if(!nickname||!note){status.textContent='닉네임과 한마디를 입력해 주세요.';return;}
   button.disabled=true;
   try{await request('post',{nickname,note});form.elements.message.value='';}catch(err){onError(err);}finally{button.disabled=false;}
 });
})();
