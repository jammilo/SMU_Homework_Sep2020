import csv

csvpath = "PyPoll/Resources/election_data.csv"
print(csvpath)

#fetch total votes
totalVotes = 0


candidateDict = {}

# read in the file
with open(csvpath, "r") as csvfile:
    csvreader = csv.reader(csvfile, delimiter=',')

# Read the header row first (skip this step if there is no header)
# csv_header = next(csvreader)
# print(f"CSV Header: {csv_header}")

# Read each row of data after the header
    for row in csvreader:
        # print(row)
        totalVotes += 1

        
# if candidate is not in the dictionary to begin with,create a new item, add value 1 to initialize
# if the candidate is already in the dictionary,keep adding 1
       
        candidate = row[2]
        if candidate not in candidateDict.keys():
            candidateDict[candidate] = 1
        else:
            candidateDict[candidate] += 1


winner = max(candidateDict, key=candidateDict.get)

# print(winner)

pollResultStrings = [f"{key}: {round((candidateDict[key] / totalVotes)*100,3)}% ({candidateDict[key]})" for key in candidateDict.keys()]
pollResultStrings = "\n".join(pollResultStrings)

summaryString = f"""Election Results
-------------------------
Total Votes: {totalVotes}
-------------------------
{pollResultStrings}
-------------------------
Winner: {winner}
-------------------------"""

print(summaryString)

#write analysis summary
with open("analysis summary.txt", "w") as file1:
    file1.write(summaryString)
