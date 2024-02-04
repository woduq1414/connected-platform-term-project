import streamlit as st
import pandas as pd
import os
import plotly.figure_factory as ff
import plotly.express as px
import plotly.graph_objects as go
# "../../connected_back/logs" 폴더에서 csv 파일 리스트를 가져오는 함수


def get_csv_file_list(folder_path):
    csv_files = sorted([f for f in os.listdir(folder_path) if f.endswith('.csv')])
    return csv_files

# 선택한 파일의 데이터를 읽어오는 함수


def read_data(file_path):
    data = pd.read_csv(file_path)
    return data

# Streamlit 애플리케이션 구성


def overall_demo():
    st.title("Overall")

    room_ids = data['roomId'].unique().tolist()

    # 멀티셀렉트를 통해 선택한 socketId 목록을 가져옴
    selected_room_ids = st.multiselect(
        "roomId 선택", room_ids, default=room_ids)

    socket_ids = data[data['roomId'].isin(
        selected_room_ids)]['socketId'].unique().tolist()
    selected_socket_ids = st.multiselect(
        "socketId 선택", socket_ids, default=socket_ids)

    # 선택한 socketId에 해당하는 데이터 필터링
    filtered_data = data[data['socketId'].isin(selected_socket_ids)]

    # 선택한 데이터의 "y"와 "time" column을 활용해 산점도 그리기
    st.subheader("그래프")

    fig = px.scatter(filtered_data, x='timestamp', y='currentTime',
                     color='socketId', color_discrete_sequence=px.colors.qualitative.G10,
                     title="Current Time vs. Timestamp"
                     )
    st.plotly_chart(fig)

    fig2 = go.Figure()
    for socket_id in selected_socket_ids:
        socket_data = filtered_data[filtered_data['socketId'] == socket_id]
        fig2.add_trace(go.Scatter(
            x=socket_data['timestamp'], y=socket_data['bufferedTime'], name=socket_id))
    fig2.update_layout(title="Buffered Time vs. Timestamp",
                       xaxis_title="Timestamp", yaxis_title="Buffered Time")
    st.plotly_chart(fig2)


    max_bufferedTime_values = filtered_data.groupby('watchId')['bufferedTime'].max()

    # 각 watchId 별 평균값 계산
    avg_bufferedTime_values = filtered_data.groupby('watchId')['bufferedTime'].mean()

    max_bitrate_values = filtered_data.groupby('watchId')['bitrate'].max()

    # 각 watchId 별 평균값 계산
    avg_bitrate_values = filtered_data.groupby('watchId')['bitrate'].mean()

    # 최대값과 평균값을 담은 테이블 생성
    table_data = pd.DataFrame({'MaxBufferedTime': max_bufferedTime_values, 'AvgBufferedTime': avg_bufferedTime_values,
                               
                               'MaxBitrate': max_bitrate_values, 'AvgBitrate': avg_bitrate_values}, )

    st.subheader("영상 watchId 별 최대/평균값")
    st.table(table_data)

def by_watchId_demo():
    st.title("영상 별로 보기")

    watchIds = data['watchId'].unique().tolist()

    selected_watch_id = st.selectbox(
        "watchId 선택", watchIds)
    
    filtered_data = data[data['watchId'] == selected_watch_id]

    selected_socket_ids = filtered_data['socketId'].unique().tolist()

    fig = go.Figure()
    for socket_id in selected_socket_ids:
        socket_data = filtered_data[filtered_data['socketId'] == socket_id]
        fig.add_trace(go.Scatter(
            x=socket_data['timestamp'], y=socket_data['bufferedTime'], name=socket_id))
    fig.update_layout(title="Buffered Time vs. Timestamp",
                       xaxis_title="Timestamp", yaxis_title="Buffered Time")
    st.plotly_chart(fig)

    fig2 = go.Figure()
    for socket_id in selected_socket_ids:
        socket_data = filtered_data[filtered_data['socketId'] == socket_id]
        fig2.add_trace(go.Scatter(
            x=socket_data['timestamp'], y=socket_data['bitrate'], name=socket_id))
    fig2.update_layout(title="Bitrate vs. Timestamp",
                          xaxis_title="bitrate", yaxis_title="Current Time")
    st.plotly_chart(fig2)
    

page_names_to_funcs = {
    "Overall": overall_demo,
    "By WatchId": by_watchId_demo,
    # "Plotting Demo": plotting_demo,
    # "Mapping Demo": mapping_demo,
    # "DataFrame Demo": data_frame_demo
}


if __name__ == "__main__":

    # "../../connected_back/logs" 폴더의 csv 파일 리스트를 가져옴
    folder_path = "../../connected_back/logs"
    csv_files = get_csv_file_list(folder_path)

    # 드롭다운 메뉴를 통해 파일 선택
    selected_file = st.sidebar.selectbox("CSV 파일 선택", csv_files)
    file_path = os.path.join(folder_path, selected_file)

    # 선택한 파일의 데이터를 읽어옴
    data = read_data(file_path)

    data['timestamp'] = data['timestamp'] / 1000
    min_timestamp = int(data['timestamp'].min())
    max_timestamp = int(data['timestamp'].max())
    

    selected_range = st.sidebar.slider("Timestamp 범위 선택", min_value=min_timestamp,
                               max_value=max_timestamp, value=(min_timestamp, max_timestamp))
    
    data = data[(data['timestamp'] >= selected_range[0]) & (data['timestamp'] <= selected_range[1])]
    
    # data에서 nan값을 가진 행 제거
    data = data.dropna()

    demo_name = st.sidebar.selectbox(
        "시각화 모드", page_names_to_funcs.keys())
    page_names_to_funcs[demo_name]()
