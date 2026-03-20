"""
1. Two Sum (LeetCode 1)
Problem Statement:
Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
You may assume that each input would have exactly one solution, and you may not use the same element twice.
Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
Example 2:
Input: nums = [3,2,4], target = 6
Output: [1,2]
"""


def two_sum(nums: list[int], target: int):
    # store element as key and index as value
    seen = {}

    # iterate over the array to get element and index each iteration
    for index, num in enumerate(nums):
        # find the difference between target and current element(num)
        diff = target - num

        # check that if diff is present inside seen dictionary
        if diff in seen:
            # return index of diff and index of current element
            return [seen[diff], index]

        # if diff is not in seen then add the current element(num)
        seen[num] = index

    # if not find the target
    return []


print(two_sum([2, 7, 11, 15], 9))
print(two_sum([3, 2, 4], 5))


"""
2. Best Time to Buy and Sell Stock (LeetCode 121)
Problem Statement:
You are given an array prices where prices[i] is the price of a given stock on the ith day.
You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.
Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.
Example 1:
Input: prices = [7,1,5,3,6,4]
Output: 5
Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.
Example 2:
Input: prices = [7,6,4,3,1]
Output: 0[7,1,5,3,6,4]
Explanation: In this case, no transactions are done and the max profit = 0.
"""


def best_time_max_profit(prices: list[int]):
    # infinite min_value
    min_value = float("inf")

    # max value found so far
    max_profit = 0

    # get each price as stock
    for price in prices:
        # if current stock price is smaller than min_value, that's means it's the new min_value
        if price < min_value:
            min_value = price

        # else  don't find the min value then, find the profit by find the difference between price and min_value
        else:
            profit = price - min_value

            # check if current profit is greater than max_profit, then assign to max_profit
            if profit > max_profit:
                max_profit = profit
    # return the max profit
    return max_profit


print(best_time_max_profit([7, 1, 5, 3, 6, 4]))
print(best_time_max_profit([7, 6, 4, 3, 1]))


"""
3. Contains Duplicate (LeetCode 217)
Problem Statement:
Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.
Example 1:
Input: nums = [1,2,3,1]
Output: true
Example 2:
Input: nums = [1,2,3,4]
Output: false
"""


def contains_duplicates(nums: list[int]):
    # store unique elements
    elements = set()

    # iterate to the array
    for num in nums:
        # if current number not present inside elements set then add that element to the elements(set)
        if num not in elements:
            elements.add(num)

        # else current element/number already present inside elements(set), Then return True
        else:
            return True
    # if all numbers in array are distinct then return False
    return False


print(contains_duplicates([1, 2, 3, 1]))
print(contains_duplicates([1, 2, 3, 4]))


"""
4. Product of Array Except Self (LeetCode 238)
Problem Statement:
Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].
The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.
You must write an algorithm that runs in O(n) time and does not use the division operation.
Example 1:
Input: nums = [1,2,3,4]
Output: [24,12,8,6]
Example 2:
Input: nums = [-1,1,0,-3,3]
Output: [0,0,9,0,0]
"""


def product_except_itself(nums: list[int]):
    """
    ----- Brute Force -----
    # result = []

    # for i in range(len(nums)):
    #     product = 1
    #     for j in range(len(nums)):
    #         if i != j:
    #             product *= nums[j]
    #     result.append(product)

    # return result
    """

    # Optimal version
    n = len(nums)

    # create a result array filled with 1s
    result = [1] * n

    # left side products
    for i in range(1, n):
        result[i] = result[i - 1] * nums[i - 1]

    # Multiply RIGHT side products
    suffix = 1  # nothing on the right yet

    for i in range(n - 1, -1, -1):
        # multiply current result (left product) with suffix (right product)
        result[i] *= suffix

        # update suffix by multiplying current number
        suffix *= nums[i]
    return result


print(product_except_itself([1, 2, 3, 4]))
print(product_except_itself([-1, 1, 0, -3, 3]))


"""
5. Maximum Subarray (LeetCode 53) – “Maximum Sum array”
Problem Statement:
Given an integer array nums, find the subarray with the largest sum, and return its sum.
Example 1:
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: The subarray [4,-1,2,1] has the largest sum = 6.
Example 2:
Input: nums = [1]
Output: 1
"""


def max_subarray(nums: list[int]):
    current_sum = nums[0]
    max_sum = nums[0]

    for num in nums:
        current_sum = max(num, current_sum + num)
        max_sum = max(current_sum, max_sum)
    return max_sum


print(max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]))
print(max_subarray([4, -1, 2, 1]))

"""
6. Longest Substring Without Repeating Characters (LeetCode 3)
Problem Statement:
Given a string s, find the length of the longest substring without repeating characters.
Example 1:
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.
Example 2:
Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.
"""


# Code here
"""
7. 3Sum (LeetCode 15)
Problem Statement:
Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, j != k, and nums[i] + nums[j] + nums[k] == 0.
The solution set must not contain duplicate triplets.
Example 1:
Input: nums = [-1,0,1,2,-1,-4]
Output: [[-1,-1,2],[-1,0,1]]
Example 2:
Input: nums = [0,1,1]
Output: []
"""


# Code here
"""
8. Container With Most Water (LeetCode 11)
Problem Statement:
You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).
Find two lines that together with the x-axis form a container, such that the container contains the most water.
Return the maximum amount of water a container can store.
Example 1:
Input: height = [1,8,6,2,5,4,8,3,7]
Output: 49
Explanation: The vertical lines at index 1 and 8 form the container with height min(8,7) = 7 and width 7, area = 49.
Example 2:
Input: height = [1,1]
Output: 1
"""


# Code here
"""
9. Group Anagrams (LeetCode 49)
Problem Statement:
Given an array of strings strs, group the anagrams together. You can return the answer in any order.
An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.
Example 1:
Input: strs = ["eat","tea","tan","ate","nat","bat"]
Output: [["bat"],["nat","tan"],["ate","eat","tea"]]
Example 2:
Input: strs = [""]
Output: [[""]]
"""


"""
10. Top K Frequent Elements (LeetCode 347)
Problem Statement:
Given an array of integers nums and an integer k, return the k most frequent elements. You may return the answer in any order.
Example 1:
Input: nums = [1,1,1,2,2,3], k = 2
Output: [1,2]
Example 2:
Input: nums = [1], k = 1
Output: [1]
"""
