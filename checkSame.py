import csv
import argparse
from pathlib import Path

def read_ids_from_csv(file_path, column=0):
    """
    从CSV读取指定列的ID，默认取第一列。
    返回一个去重后的set。
    """
    ids = set()
    try:
        with open(file_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.reader(csvfile)
            for row in reader:
                if row and len(row) > column:
                    ids.add(row[column].strip())
    except FileNotFoundError:
        print(f"文件未找到: {file_path}")
    except Exception as e:
        print(f"读取文件 {file_path} 时出错: {e}")
    return ids

def check_ids(big_csv, small_csv, column_big=0, column_small=0, output_file=None):
    """
    对比两个CSV的指定列ID，输出存在和不存在的列表。
    """
    big_ids = read_ids_from_csv(big_csv, column_big)
    small_ids = read_ids_from_csv(small_csv, column_small)

    exists = [id_ for id_ in small_ids if id_ in big_ids]
    missing = [id_ for id_ in small_ids if id_ not in big_ids]

    print(f"共检查 {len(small_ids)} 个 ID")
    print(f"存在 {len(exists)} 个")
    print(f"不存在 {len(missing)} 个")

    if output_file:
        try:
            with open(output_file, 'w', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                writer.writerow(["ID", "Status"])
                for id_ in exists:
                    writer.writerow([id_, "存在"])
                for id_ in missing:
                    writer.writerow([id_, "不存在"])
            print(f"结果已保存到 {output_file}")
        except Exception as e:
            print(f"写入文件 {output_file} 时出错: {e}")

    return exists, missing

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="对比两个CSV文件中的ID")
    parser.add_argument("big_csv", help="大CSV文件路径")
    parser.add_argument("small_csv", help="小CSV文件路径")
    parser.add_argument("--column_big", type=int, default=0, help="大CSV文件ID所在列（从0开始）")
    parser.add_argument("--column_small", type=int, default=0, help="小CSV文件ID所在列（从0开始）")
    parser.add_argument("--output", help="可选：输出结果到CSV文件")

    args = parser.parse_args()

    check_ids(
        big_csv=args.big_csv,
        small_csv=args.small_csv,
        column_big=args.column_big,
        column_small=args.column_small,
        output_file=args.output
    )
