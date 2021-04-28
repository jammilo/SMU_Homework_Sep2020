# Pandas Jupyter Notebook

## Background


![Fantasy](Images/Fantasy.png)

Analyze the data for an independent gaming company for their most recent fantasy game Heroes of Pymoli as a Lead Analyst.

Like many others in its genre, the game is free-to-play, but players are encouraged to purchase optional items that enhance their playing experience.
As a first task, the company would like to generate a report that breaks down the game's purchasing data into meaningful insights.

The final report should include each of the following:

### Player Count

* Total Number of Players
 ```python
#get the count
playerCount = df.SN.nunique()

#create table
playerCount_df = pd.DataFrame()
playerCount_df["Total Players"] = [playerCount]

#print
playerCount_df
```
<img width="100" alt="圖片" src="https://user-images.githubusercontent.com/70195202/116376317-be72cf80-a7d5-11eb-9103-ffc4c4e8ff06.png">


### Purchasing Analysis (Total)

* Number of Unique Items
* Average Purchase Price
* Total Number of Purchases
* Total Revenue
```python
#get the number
uniqItem = df["Item Name"].nunique()
avePrice = df.Price.mean()
numPurchasing = df["Purchase ID"].count() 
totRev = df.Price.sum()


#create summary table
purchasingAnalysis = pd.DataFrame()
purchasingAnalysis["Number of Unique Items"] = [uniqItem]
purchasingAnalysis["Average Price"] = [avePrice]
purchasingAnalysis["Number of Purchases"] = [numPurchasing]
purchasingAnalysis["Total Revenue"] = [totRev]

#format the number
purchasingAnalysis["Average Price"] = purchasingAnalysis["Average Price"].map("${:.2f}".format)
purchasingAnalysis["Total Revenue"] = purchasingAnalysis["Total Revenue"].map("${:.2f}".format)

purchasingAnalysis
```
<img width="448" alt="圖片" src="https://user-images.githubusercontent.com/70195202/116376849-3fca6200-a7d6-11eb-9ffa-11905da3cbe1.png">


### Gender Demographics

* Percentage and Count of Male Players
* Percentage and Count of Female Players
* Percentage and Count of Other / Non-Disclosed
```python
people_df = df.groupby(['SN','Gender']).size().reset_index().rename(columns={0:'count'})
#make the columns first
genderCount = people_df.Gender.value_counts()
genderPerc = genderCount / len(people_df)

#make the table
genderTable = pd.DataFrame()
genderTable["Total Count"] = genderCount
genderTable["Percentage of Players"] = genderPerc * 100

#format
genderTable["Percentage of Players"] = genderTable["Percentage of Players"].map("{:.2f}%".format)

#print
genderTable
```
<img width="325" alt="圖片" src="https://user-images.githubusercontent.com/70195202/116377038-6ab4b600-a7d6-11eb-8855-0993e71303cc.png">


### Purchasing Analysis (Gender)

* The below each broken by gender
  * Purchase Count
  * Average Purchase Price
  * Total Purchase Value
  * Average Purchase Total per Person by Gender
```python
#get the columns
genderSize = df.groupby("Gender").size()
genderAvgPrice = df.groupby("Gender").Price.mean()
genderTotPrice = df.groupby("Gender").Price.sum()
genderAvgPerPerson = df.groupby("Gender").Price.sum() / genderTable["Total Count"]
#make the table
genderPurchasingTable = pd.DataFrame()
genderPurchasingTable["Purchase Count"] = genderSize
genderPurchasingTable["Average Purchase Price"] = genderAvgPrice
genderPurchasingTable["Total Purchase Value"] = genderTotPrice
genderPurchasingTable["Avg Total Purchase per Person"] = genderAvgPerPerson

#format
genderPurchasingTable["Average Purchase Price"] = genderPurchasingTable["Average Purchase Price"].map("${:,.2f}".format)
genderPurchasingTable["Total Purchase Value"] = genderPurchasingTable["Total Purchase Value"].map("${:,.2f}".format)
genderPurchasingTable["Avg Total Purchase per Person"] = genderPurchasingTable["Avg Total Purchase per Person"].map("${:,.2f}".format)

#print
genderPurchasingTable
```
<img width="646" alt="圖片" src="https://user-images.githubusercontent.com/70195202/116453652-c1e17780-a824-11eb-9377-528bcabcd1bb.png">


### Age Demographics

* The below each broken into bins of 4 years (i.e. &lt;10, 10-14, 15-19, etc.)
  * Purchase Count
  * Average Purchase Price
  * Total Purchase Value
  * Average Purchase Total per Person by Age Group
```pythpn
# Create bins in which to place values based upon player ages
bins = [0, 9, 14, 19, 24, 29, 34, 39, 50]

# Create labels for these bins
group_labels = [" <10", "10-14", "15-19", "20-24", "25-29", "30-34", "35-39", "40+"]

# Slice the data and place it into bins
df["Age Group"] = pd.cut(df["Age"], bins, labels=group_labels).astype(str)
df.head()
people_df2 = df.groupby(['SN','Age Group']).size().reset_index().rename(columns={0:'count'})
people_df2
# Create bins in which to place values based upon player ages
bins = [0, 9, 14, 19, 24, 29, 34, 39, 50]

# Create labels for these bins
group_labels = [" <10", "10-14", "15-19", "20-24", "25-29", "30-34", "35-39", "40+"]

# Slice the data and place it into bins
df["Age Group"] = pd.cut(df["Age"], bins, labels=group_labels).astype(str)


ageGroupTable = people_df2.groupby("Age Group").size().reset_index().rename(columns={0:'Total Count'})
ageGroupTable["Percentage of Players"] = ageGroupTable["Total Count"] / len(people_df2) * 100

#format
ageGroupTable["Percentage of Players"] = ageGroupTable["Percentage of Players"].map("{:.2f}%".format)

ageGroupTable = ageGroupTable.set_index("Age Group")
ageGroupTable
#get the columns
ageSize = df.groupby("Age Group").size()
ageAvgPrice = df.groupby("Age Group").Price.mean()
ageTotPrice = df.groupby("Age Group").Price.sum()
ageAvgPerPerson = df.groupby("Age Group").Price.sum() / ageGroupTable["Total Count"] # NOTE THE AGE COUNT USE HERE - HAVE TO GET UNIQUE PEOPLE

#make the table
agePurchasingTable = pd.DataFrame()
agePurchasingTable["Purchase Count"] = ageSize
agePurchasingTable["Average Purchase Price"] = ageAvgPrice
agePurchasingTable["Total Purchase Value"] = ageTotPrice
agePurchasingTable["Avg Total Purchase per Person"] = ageAvgPerPerson

#format
agePurchasingTable["Average Purchase Price"] = agePurchasingTable["Average Purchase Price"].map("${:,.2f}".format)
agePurchasingTable["Total Purchase Value"] = agePurchasingTable["Total Purchase Value"].map("${:,.2f}".format)
agePurchasingTable["Avg Total Purchase per Person"] = agePurchasingTable["Avg Total Purchase per Person"].map("${:,.2f}".format)

#print
agePurchasingTable
```
<img width="644" alt="圖片" src="https://user-images.githubusercontent.com/70195202/116452813-c194ac80-a823-11eb-9a64-4ba40f8e0b60.png">
<img width="268" alt="圖片" src="https://user-images.githubusercontent.com/70195202/116452850-cce7d800-a823-11eb-8517-249470caf506.png">
<img width="598" alt="圖片" src="https://user-images.githubusercontent.com/70195202/116453109-16382780-a824-11eb-8b03-c0ac46f59947.png">


### Top Spenders

* Identify the the top 5 spenders in the game by total purchase value, then list (in a table):
  * SN
  * Purchase Count
  * Average Purchase Price
  * Total Purchase Value
```pythpn
#get the columns
sNSize = df.groupby("SN").size()
sNAvgPrice = df.groupby("SN").Price.mean()
sNTotPrice = df.groupby("SN").Price.sum()

#make the table
sNPurchasingTable = pd.DataFrame()
sNPurchasingTable["Purchase Count"] = sNSize
sNPurchasingTable["Average Purchase Price"] = sNAvgPrice
sNPurchasingTable["Total Purchase Value"] = sNTotPrice

#format
sNPurchasingTable["Average Purchase Price"] = sNPurchasingTable["Average Purchase Price"].map("${:,.2f}".format)
sNPurchasingTable["Total Purchase Value"] = sNPurchasingTable["Total Purchase Value"].map("${:,.2f}".format)

#print
sNPurchasingTable = sNPurchasingTable.sort_values(by="Total Purchase Value", ascending=False)
sNPurchasingTable.head()
```
<img width="427" alt="圖片" src="https://user-images.githubusercontent.com/70195202/116453190-31a33280-a824-11eb-9c08-0fc0aa0da260.png">

### Most Popular Items

* Identify the 5 most popular items by purchase count, then list (in a table):
  * Item ID
  * Item Name
  * Purchase Count
  * Item Price
  * Total Purchase Value
```pythpn
#get the columns
itemSize = df.groupby(["Item ID", "Item Name"]).size()
itemAvgPrice = df.groupby(["Item ID", "Item Name"]).Price.mean()
itemTotPrice = df.groupby(["Item ID", "Item Name"]).Price.sum()

#make the table
itemPurchasingTable = pd.DataFrame()
itemPurchasingTable["Purchase Count"] = itemSize
itemPurchasingTable["Item Price"] = itemAvgPrice
itemPurchasingTable["Total Purchase Value"] = itemTotPrice

#sort
itemPurchasingTable = itemPurchasingTable.sort_values(by="Purchase Count", ascending=False)

#format
itemPurchasingTable["Item Price"] = itemPurchasingTable["Item Price"].map("${:,.2f}".format)
itemPurchasingTable["Total Purchase Value"] = itemPurchasingTable["Total Purchase Value"].map("${:,.2f}".format)

#print
itemPurchasingTable.head()
```
<img width="574" alt="圖片" src="https://user-images.githubusercontent.com/70195202/116453259-47185c80-a824-11eb-8bf3-bee99a41d7cf.png">

### Most Profitable Items

* Identify the 5 most profitable items by total purchase value, then list (in a table):
  * Item ID
  * Item Name
  * Purchase Count
  * Item Price
  * Total Purchase Value
```pythpn
#get the columns
itemSize = df.groupby(["Item ID", "Item Name"]).size()
itemAvgPrice = df.groupby(["Item ID", "Item Name"]).Price.mean()
itemTotPrice = df.groupby(["Item ID", "Item Name"]).Price.sum()

#make the table
itemPurchasingTable = pd.DataFrame()
itemPurchasingTable["Purchase Count"] = itemSize
itemPurchasingTable["Item Price"] = itemAvgPrice
itemPurchasingTable["Total Purchase Value"] = itemTotPrice

#sort
itemPurchasingTable = itemPurchasingTable.sort_values(by="Total Purchase Value", ascending=False)

#format
itemPurchasingTable["Item Price"] = itemPurchasingTable["Item Price"].map("${:,.2f}".format)
itemPurchasingTable["Total Purchase Value"] = itemPurchasingTable["Total Purchase Value"].map("${:,.2f}".format)

#print
itemPurchasingTable.head()
```
 <img width="574" alt="圖片" src="https://user-images.githubusercontent.com/70195202/116453306-55667880-a824-11eb-8e7c-9b906eb6b9be.png">
 

