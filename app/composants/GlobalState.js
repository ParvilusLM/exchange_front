'use client'
import React, {useState, useEffect} from 'react'
import useSWR from 'swr'
import { useDispatch, useSelector } from'react-redux'
import { ajoutDevise } from '@/app/store-rtk/slices/deviseSlice'
import { get_all_taux_de_change } from '@/Services/taux-de-change/index' 

function GlobalState(props) {
    const dispatch = useDispatch();

    const { data, error, isLoading } = useSWR('/devise', () => get_all_taux_de_change(), {
        revalidateIfStale: true,    
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    })



    useEffect(() => {
        if(!isLoading) {
            if(data) {
                dispatch(ajoutDevise(data.data))
            }
        }
        
    }, [data, error, isLoading]);


    return null
}

export default GlobalState