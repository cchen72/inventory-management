import csv

def read_ids_from_csv(file_path, column=0):
    """从CSV读取指定列的ID，默认取第一列"""
    ids = set()
    with open(file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            if row and len(row) > column:
                ids.add(row[column].strip())
    return ids

def check_ids(big_csv, small_csv, column_big=0, column_small=0):
    big_ids = read_ids_from_csv(big_csv, column_big)
    small_ids = read_ids_from_csv(small_csv, column_small)

    exists = [id_ for id_ in small_ids if id_ in big_ids]
    missing = [id_ for id_ in small_ids if id_ not in big_ids]

    print(f"共检查 {len(small_ids)} 个 ID")
    print(f"存在 {len(exists)} 个：{exists}")
    print(f"不存在 {len(missing)} 个：{missing}")

if __name__ == "__main__":
    # 修改成你的文件路径和列索引
    check_ids("SHI25.csv", "sinbase.csv", column_big=0, column_small=0)
