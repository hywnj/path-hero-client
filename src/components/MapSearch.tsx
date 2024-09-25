import React, { useEffect, useRef, useState } from "react";
import {
  TextField,
  Button,
  List,
  ListItemText,
  Typography,
  Box,
  ListItemButton,
  ListItem,
} from "@mui/material";
import { Path, SubPath } from "../types";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface Location {
  title: string;
  address: string;
  mapx: string; // 경도
  mapy: string; // 위도
}

const NaverMapSearch = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // 컴포넌트 마운트 이후 Login 안된 상태면 home으로 이동
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const [departureQuery, setDepartureQuery] = useState("");
  const [arrivalQuery, setArrivalQuery] = useState("");
  const [departureResults, setDepartureResults] = useState<Location[]>([]);
  const [arrivalResults, setArrivalResults] = useState<Location[]>([]);
  const [selectedDeparture, setSelectedDeparture] = useState<Location | null>(
    null
  );
  const [selectedArrival, setSelectedArrival] = useState<Location | null>(null);

  const [departureErrorMsg, setDepartureErrorMsg] = useState("");
  const [arrivalErrorMsg, setArrivalErrorMsg] = useState("");

  const [directionsResult, setDirectionsResult] = useState<Path[]>([]);
  const [selectedPath, setSelectedPath] = useState<Path | null>(null); // 선택된 경로 저장
  const [subPath, setSubPath] = useState<SubPath[]>([]);

  // 경로 검색시 리스트로 스크롤
  const resultListRef = useRef<HTMLDivElement | null>(null); // ref에 타입 명시
  const arrivalResultsRef = useRef<HTMLDivElement | null>(null);
  const confirmMsgRef = useRef<HTMLDivElement | null>(null);

  // 경로 검색 결과 나올때 스크롤
  useEffect(() => {
    if (directionsResult.length > 0 && resultListRef.current) {
      setTimeout(() => {
        resultListRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100); // 약간의 지연을 주어 정확하게 스크롤
    }
  }, [directionsResult]);
  // 도착지 검색 결과 나올때 스크롤
  useEffect(() => {
    if (arrivalResults.length > 0 && arrivalResultsRef.current) {
      setTimeout(() => {
        arrivalResultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100); // 약간의 지연을 주어 정확하게 스크롤
    }
  }, [arrivalResults]);
  // 도착지 선택 했을때 스크롤
  useEffect(() => {
    if (selectedArrival && confirmMsgRef.current) {
      setTimeout(() => {
        confirmMsgRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100); // 약간의 지연을 주어 정확하게 스크롤
    }
  }, [selectedArrival]);

  // 출발지 검색 실행
  const handleSearchDeparture = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/location/search?query=${departureQuery}`
      );
      // 결과 null 확인
      const checkData = await response.text();

      if (!checkData) {
        setDepartureErrorMsg("출발지 검색 결과가 없습니다.");
        return;
      }

      const data = JSON.parse(checkData); // 텍스트 데이터를 JSON으로 파싱
      setDepartureResults(data.items); // 출발지 검색 결과 저장
    } catch (error) {
      console.error("Error fetching departure search results:", error);
    }
  };

  // 도착지 검색 실행
  const handleSearchArrival = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/location/search?query=${arrivalQuery}`
      );
      // 결과 null 확인
      const checkData = await response.text();

      if (!checkData) {
        setArrivalErrorMsg("도착지 검색 결과가 없습니다.");
        return;
      }

      const data = JSON.parse(checkData); // 텍스트 데이터를 JSON으로 파싱
      setArrivalResults(data.items); // 도착지 검색 결과 저장
    } catch (error) {
      console.error("Error fetching arrival search results:", error);
    }
  };

  // 위도/경도 값을 변환하는 함수 (정수 -> 소수점 7자리)
  const convertCoordinate = (value: string) => {
    return (parseFloat(value) / 1_000_0000).toFixed(7);
  };

  // 출발지와 도착지 정보를 서버로 전송하는 함수
  const sendLocationsToServer = async () => {
    if (!selectedDeparture || !selectedArrival) return;

    const convertedStartX = convertCoordinate(selectedDeparture.mapx); // 출발지 경도 변환
    const convertedStartY = convertCoordinate(selectedDeparture.mapy); // 출발지 위도 변환
    const convertedEndX = convertCoordinate(selectedArrival.mapx); // 도착지 경도 변환
    const convertedEndY = convertCoordinate(selectedArrival.mapy); // 도착지 위도 변환

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/directions/search`,
        {
          // 주소 변경하기 !!! /api/directions/search
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            startX: convertedStartX, // 출발지 경도
            startY: convertedStartY, // 출발지 위도
            endX: convertedEndX, // 도착지 경도
            endY: convertedEndY, // 도착지 위도
            mapX: convertedStartX, // 임의로 mapX에 출발지 경도를 넣음
            mapY: convertedStartY, // 임의로 mapY에 출발지 위도를 넣음
            choice: 1,
          }),
        }
      );

      if (response.ok) {
        alert("Locations sent to server successfully!");
        const data: Path[] = await response.json(); // 서버에서 받은 데이터를 Directions 배열로 변환
        console.log(data);

        setDirectionsResult(data.path); // setDirections로 상태 업데이트
      } else {
        console.error("Error sending locations to server");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // 빠른 길찾기
  const sendQuickLocationsToServer = async (choice: number = 0) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/directions/search`,
        {
          // 주소 변경하기 !!! /api/directions/search
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            startX: 1, // 출발지 경도
            startY: 1, // 출발지 위도
            endX: 1, // 도착지 경도
            endY: 1, // 도착지 위도
            mapX: 1, // 임의로 mapX에 출발지 경도를 넣음
            mapY: 1, // 임의로 mapY에 출발지 위도를 넣음
            choice: choice,
          }),
        }
      );

      if (response.ok) {
        alert("Locations sent to server successfully!");
        const data: Path[] = await response.json(); // 서버에서 받은 데이터를 Directions 배열로 변환
        console.log(data);

        setDirectionsResult(data.path); // setDirections로 상태 업데이트
      } else {
        console.error("Error sending locations to server");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // 로그아웃
  const handleLogout = () => {
    // 로그아웃 시 스프링 백엔드의 로그아웃 URL 호출
    window.location.href = `${import.meta.env.VITE_SERVER_URL}/logout`;
  };

  // 경로 상세정보 css
  const getBorderColor = (trafficType: number) => {
    switch (trafficType) {
      case 1:
        return "#4CAF50"; // 지하철 - 초록색
      case 2:
        return "#2196F3"; // 버스 - 파란색
      case 3:
        return "#9E9E9E"; // 도보 - 회색
      default:
        return "#000"; // 기본 값
    }
  };
  const getBackgroundColor = (trafficType: number) => {
    switch (trafficType) {
      case 1:
        return "rgba(76, 175, 80, 0.1)"; // 지하철 - 연한 초록색
      case 2:
        return "rgba(33, 150, 243, 0.1)"; // 버스 - 연한 파란색
      case 3:
        return "rgba(158, 158, 158, 0.1)"; // 도보 - 연한 회색
      default:
        return "rgba(0, 0, 0, 0.1)"; // 기본 값
    }
  };
  return (
    <Box sx={{ padding: 4 }}>
      {/* 상단에 제목과 로그아웃 버튼 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          경로 검색 (출발지 & 도착지)
        </Typography>
        <Button variant="outlined" color="secondary" onClick={handleLogout}>
          로그아웃
        </Button>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 4 }}>
        {/* 왼쪽 검색 입력 영역 */}
        <Box sx={{ width: "50%" }}>
          {/* 출발지 검색 */}
          <Typography variant="h6" sx={{ marginBottom: 1.5 }}>
            출발지 검색
          </Typography>
          <Box sx={{ display: "flex", gap: 2, marginBottom: 4 }}>
            <TextField
              label="출발지를 입력하세요"
              variant="outlined"
              fullWidth
              value={departureQuery}
              onChange={(e) => setDepartureQuery(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearchDeparture}
            >
              검색
            </Button>
          </Box>
          {departureErrorMsg && (
            <Typography variant="body2" color="error">
              {departureErrorMsg}
            </Typography>
          )}

          {selectedDeparture && (
            <Box mt={2}>
              <Typography variant="h6">선택된 출발지</Typography>
              <Typography variant="body1" sx={{ color: "gray" }}>
                {selectedDeparture.title}
              </Typography>
              <Typography variant="body1" sx={{ color: "gray" }}>
                {selectedDeparture.address}
              </Typography>
            </Box>
          )}

          {/* 도착지 검색 */}
          <Typography variant="h6" sx={{ marginTop: 4, marginBottom: 1.5 }}>
            도착지 검색
          </Typography>
          <Box sx={{ display: "flex", gap: 2, marginBottom: 1 }}>
            <TextField
              label="도착지를 입력하세요"
              variant="outlined"
              fullWidth
              value={arrivalQuery}
              onChange={(e) => setArrivalQuery(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearchArrival}
            >
              검색
            </Button>
          </Box>
          {arrivalErrorMsg && (
            <Typography variant="body2" color="error">
              {arrivalErrorMsg}
            </Typography>
          )}

          {selectedArrival && (
            <Box mt={2}>
              <Typography variant="h6">선택된 도착지</Typography>
              <Typography variant="body1" sx={{ color: "gray" }}>
                {selectedArrival.title}
              </Typography>
              <Typography variant="body1" sx={{ color: "gray" }}>
                {selectedArrival.address}
              </Typography>
            </Box>
          )}
        </Box>

        {/* 오른쪽 리스트 영역 */}
        <Box sx={{ width: "40%", height: "500px", overflowY: "auto" }}>
          <Typography variant="h6">출발지 리스트</Typography>
          <List>
            {departureResults.map((item, index) => (
              <ListItemButton
                key={index}
                onClick={() => {
                  setSelectedDeparture(item); // 항목 선택
                }}
              >
                <ListItemText
                  primary={item.title.replace(/<\/?b>/g, "")} // HTML 태그 제거
                  secondary={item.address}
                />
              </ListItemButton>
            ))}
          </List>

          <Typography
            variant="h6"
            sx={{ marginTop: 4 }}
            ref={arrivalResultsRef}
          >
            도착지 리스트
          </Typography>
          <List>
            {arrivalResults.map((item, index) => (
              <ListItemButton
                key={index}
                onClick={() => setSelectedArrival(item)}
              >
                <ListItemText
                  primary={item.title.replace(/<\/?b>/g, "")} // HTML 태그 제거
                  secondary={item.address}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Box>

      {/* 선택된 출발지 및 도착지 표시 */}
      {selectedDeparture && selectedArrival && (
        <Box
          mt={4}
          textAlign="center"
          sx={{
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: 2 }} ref={confirmMsgRef}>
            <b style={{ color: "purple", fontSize: "1.2em" }}>
              {selectedDeparture.title.replace(/<\/?b>/gi, "")}
            </b>{" "}
            에서{" "}
            <b style={{ color: "purple", fontSize: "1.2em" }}>
              {selectedArrival.title.replace(/<\/?b>/g, "")}
            </b>{" "}
            로 가실건가요?
          </Typography>

          <Button
            variant="contained"
            color="secondary"
            onClick={sendLocationsToServer}
            sx={{ marginTop: 2, padding: "10px 20px", fontSize: "1rem" }}
          >
            경로 찾기
          </Button>
        </Box>
      )}
      {/* 빠른 찾기 버튼들 추가 */}
      <Box mt={4}>
        {/* 빠른 찾기 버튼들 */}
        <Box mt={2} display="flex" gap={2}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => sendQuickLocationsToServer(1)}
          >
            빠른 찾기 1
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => sendQuickLocationsToServer(2)}
          >
            빠른 찾기 2
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => sendQuickLocationsToServer(3)}
          >
            빠른 찾기 3
          </Button>
        </Box>
      </Box>
      <Box mt={4}>
        {/* 결과 리스트 */}
        {directionsResult && directionsResult.length > 0 && (
          <Box display="flex" mt={4} ref={resultListRef}>
            {/* 왼쪽 리스트 영역 */}
            <Box width="40%" mr={2}>
              <Typography variant="h6">경로 리스트</Typography>
              <List>
                {directionsResult.map((item, index) => (
                  <ListItemButton
                    key={index}
                    onClick={() => {
                      setSelectedPath(item);
                      setSubPath(item.subPath);
                    }}
                  >
                    <ListItemText
                      primary={`${item.info.totalTime}분`}
                      secondary={
                        <>
                          {`출발: ${item.info.firstStartStation}`} <br />
                          {`도착: ${item.info.lastEndStation}`} <br />총 요금은,{" "}
                          <b>{`${item.info.payment}원`}</b>이고,
                          <b>{`${item.info.totalWalk}m`}</b> 걸어가야 해요!{" "}
                          <br />
                          {`지하철 환승: ${item.info.subwayTransitCount}회 | 버스 환승: ${item.info.busTransitCount}회 `}
                        </>
                      }
                    />
                  </ListItemButton>
                ))}
              </List>
            </Box>

            {/* 오른쪽 상세 정보 영역 */}
            <Box width="60%" ml={2} borderLeft="1px solid #ddd" pl={2}>
              {selectedPath ? (
                <>
                  <Typography variant="h6" gutterBottom>
                    선택된 경로 상세 정보
                  </Typography>

                  {/* subPath 정보를 리스트로 출력 */}
                  <List>
                    {subPath.map((item, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          border: `2px solid ${getBorderColor(
                            item.trafficType
                          )}`, // 테두리 색상 설정
                          backgroundColor: `${getBackgroundColor(
                            item.trafficType
                          )}`, // 배경색 설정
                          borderRadius: "8px", // 테두리 둥글게
                          marginBottom: "10px", // 구간 간 간격
                          padding: "16px", // 패딩 추가
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography variant="body1" fontWeight="bold">
                              {`구간 ${index + 1}: ${
                                item.trafficType === 1
                                  ? "지하철"
                                  : item.trafficType === 2
                                  ? "버스"
                                  : "도보"
                              }`}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" color="textSecondary">
                              {`거리: ${item.distance}m, 소요 시간: ${item.sectionTime}분`}{" "}
                              <br />
                              {item.stationCount &&
                                `역 개수: ${item.stationCount}`}{" "}
                              <br />
                              {item.startName &&
                                `출발지: ${item.startName}`}{" "}
                              <br />
                              {item.endName && `도착지: ${item.endName}`} <br />
                              {item.lane &&
                                item.lane.length > 0 &&
                                `노선: ${item.lane
                                  .map((l) => l.name)
                                  .join(", ")}`}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>

                  {/* 선택된 경로의 기본 정보 - 메모지 스타일 */}
                  <Box
                    mt={2}
                    sx={{
                      backgroundColor: "#FFEB3B", // 노란색 메모지 느낌
                      borderRadius: "8px",
                      padding: "16px",
                      border: "1px dashed #FFC107", // 메모지 느낌을 위한 점선 테두리
                      boxShadow: "2px 2px 6px rgba(0, 0, 0, 0.2)", // 살짝 그림자
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: "Comic Sans MS",
                        fontWeight: "bold",
                      }}
                    >
                      경로 요약 정보
                    </Typography>
                    <Typography variant="body1">
                      출발지: {selectedPath.info.firstStartStation}
                    </Typography>
                    <Typography variant="body1">
                      도착지: {selectedPath.info.lastEndStation}
                    </Typography>
                    <Typography variant="body1">
                      총 시간: {selectedPath.info.totalTime}분
                    </Typography>
                    <Typography variant="body1">
                      총 요금: {selectedPath.info.payment}원
                    </Typography>
                    <Typography variant="body1">
                      총 거리: {selectedPath.info.totalDistance}m
                    </Typography>
                    <Typography variant="body1">
                      총 걷는 거리: {selectedPath.info.totalWalk}m
                    </Typography>
                  </Box>
                </>
              ) : (
                <Typography variant="body1">경로를 선택해 주세요</Typography>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default NaverMapSearch;
