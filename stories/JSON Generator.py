import csv 
import sys
import os

def get_last(a):
  for i, e in enumerate(reversed(a)):
    if e is not "":
      return len(a) - i - 1
  return -1
name = "INTRO-diff"
file= open(name+".json","w+")


with open(name+'.csv') as csvfile:
    readCSV = csv.reader(csvfile, delimiter=',')
    finalResult = ""
    for index,row in enumerate(readCSV):
        print(row)
        if (row[0] != ""):
            result = '\n'
            result +='"'+row[0]+'":{\n'
            result +='    "content":    "'+row[1]+'",\n'
            result +='    "discussion": "'+row[2]+'",\n'
            result +='    "type":       "'+row[3]+'",\n'
            if (row[3] == "0"):
                result +='    "delay":      "'+row[4]+'",\n'
                result +='    "nextElement":"'+row[5]+'"\n'
            if (row[3] == "1"):
                result +='    "choices":{ \n'
                rowIndexofLast = get_last(row)
                for i in range(6,rowIndexofLast,2):
                    result +='        "'+row[i]+'":"'+row[i+1]+'"'
                    if (i+1 != rowIndexofLast):
                        result += ','
                    result += '\n'
                result +='    }\n'
            result +='}'
            result +=','
            finalResult += result
    finalResult = finalResult[:-1]
    print(finalResult)


file.truncate()
file.write(finalResult)
file.close()
