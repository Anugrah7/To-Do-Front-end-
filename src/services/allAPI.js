import commonAPI from './commonAPI';
import SERVER_BASE_URL from './serverURL';

export const addTaskAPI = async (reqBody,reqHeader)=>{
    return await commonAPI("POST",`${SERVER_BASE_URL}/add-task`,reqBody,reqHeader)
}

export const getTaskAPI = async ()=>{
    return await commonAPI("GET",`${SERVER_BASE_URL}/get-task`)
}

export const updateTaskAPI = async (id,updatedData)=>{
    return await commonAPI("PUT",`${SERVER_BASE_URL}/update-task/${id}`,updatedData)
}

export const deleteTaskAPI = async (id,reqHeader)=>{
    return await commonAPI("DELETE",`${SERVER_BASE_URL}/delete-task/${id}`,reqHeader)
}