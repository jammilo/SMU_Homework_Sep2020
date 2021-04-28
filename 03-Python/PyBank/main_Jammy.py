import csv
import numpy as np

csvpath = "PyBank/Resources/budget_data.csv"
print(csvpath)

totalMonths = 0
totalProfitLoss = 0
changeDict = {}

isFirstRow = True
lastRowProfit = 0

# read in the file
with open(csvpath, "r") as csvfile:
    csvreader = csv.reader(csvfile, delimiter=',')

# Read the header row first (skip this step if there is no header)
    csv_header = next(csvreader)
    print(f"CSV Header: {csv_header}")

# Read each row of data after the header
    for row in csvreader:

#row[0] = Month-Year
#row[1] = Profit/Loss

        totalMonths += 1
        totalProfitLoss += int(row[1])


        if isFirstRow:
            lastRowProfit = int(row[1])
            isFirstRow = False
        else:
            change = int(row[1])-lastRowProfit
            changeDict[row[0]] = change
            lastRowProfit = int(row[1])

averageChange = np.mean(list(changeDict.values()))

#counting max profit change month value 
maxChangeMonth = max(changeDict, key=changeDict.get) 
maxChangeValue = changeDict[maxChangeMonth]
#counting min profit change month value 
minChangeMonth = min(changeDict, key=changeDict.get) 
minChangeValue = changeDict[minChangeMonth]

summaryString = f"""Finanical Analysis
-------------------------
Total Months: {totalMonths}
Total: ${totalProfitLoss}
Average Change: ${round(averageChange, 2)}
Greatest Increase in Profits: {maxChangeMonth} (${maxChangeValue})
Greatest Decrease in Profits: {minChangeMonth} (${minChangeValue})
"""
print(summaryString)

# writing analysis summary
with open("analysis summary.txt", "w") as file1:
    file1.write(summaryString)

