import { Input } from '@/components/ui/input'
import React from 'react'

function page() {
  return (
    <div className='flex py-[3rem] px-[2rem] bg-[#031b4e0a] overflow-auto h-full relative flex-1'>
      <div
        className='w-full max-w-[74.43rem] mx-auto'
      >
        <div
          className='box-content flex items-center justify-center text-[12px]'
        >
          <div>
            <div className='flex flex-row justify-between w-full mb-[0.825rem]'>
              <span>

                Invoice #AD123
              </span>
              <div>
                <span>Created on</span>
                <span>01/01/2023</span>
              </div>
            </div>
            <div className='overflow-initial  w-[74.43rem] h-auto min-h-[105.83rem] relative bg-white flex flex-col flex-none border border-[rgba(3,27,78,0.12)] shadow-[0_0_0.1px_rgba(0,0,0,0.01),0_0.1px_0.3px_rgba(0,0,0,0.016),0_0.1px_0.5px_rgba(0,0,0,0.02),0_0.2px_0.9px_rgba(0,0,0,0.024),0_0.4px_1.7px_rgba(0,0,0,0.027),0_1px_4px_rgba(0,0,0,0.04)] text-[1em] mb-[3em]'>
              <div className="box-border relative min-h-0 flex-1 flex flex-col p-[5.31496rem] pb-[8.85827rem]">
                <div className='uppercase mx-auto mb-[0.5em] clear-both text-center font-arial text-black text-[2em] font-bold border-b border-dashed border-[rgba(3,27,78,0.2)] p-0 px-[0.5em] pb-[0.125em] whitespace-pre-wrap cursor-text hover:border-b hover:border-dashed hover:border-[rgba(3,27,78,0.55)] hover:bg-[rgba(3,27,78,0.04)]'>
                  Invoice
                </div>
                <div className='mainbox box-border relative flex flex-col min-h-0 flex-1 border border-gray-200'>
                  <div className='"box-border relative flex flex-col flex-[0_1_0] w-full min-w-0 min-h-0"'>
                    <div className='box-border relative flex flex-col flex-auto w-full min-w-0 min-h-0 flex-1'>
                      <div className='box-border relative flex flex-col flex-1 flex-[1_1_auto] h-full'>
                        <div className='box-border relative flex flex-row flex-1 h-full'>
                          {/* seller component left side */}
                          <div className='box-border relative flex flex-col flex-auto w-full min-w-0 min-h-0 flex-1'>
                            <div className="absolute pointer-events-none border border-[#d5dae4] z-[1] inset-[-1px_0_0_-1px]"></div>
                            <div className='relative box-border'>
                              <div className='flex flex-row justify-between items-center relative min-h-[2em] pt-[0.5em] cursor-pointer transition ease-in-out duration-[10ms] hover:bg-[#031b4e05]'>
                                <div className='whitespace-break-spaces box-border text-[0.75em] font-medium m-[0.5em] w-full text-[rgba(3,27,78,0.75)] !font-inter'>Seller</div>
                              </div>
                              <div className='flex flex-col gap-[0.5em] flex-auto p-[0.5em] min-h-0'>
                                <div className="flex flex-row max-w-[26.75em]">
                                  <Input placeholder='Name' className='w-full m-0 text-[0.75em] font-medium  w-full text-[rgba(3,27,78,0.75)] !font-inter py-[0.75em] h-fit px-[1em] bg-[#031b4e0a]' />
                                </div>
                                <div className="box-border relative flex flex-row">
                                  <div className='box-border relative flex flex-1 min-h-[8em]'>
                                    <p className='m-0 outline-none border-0 leading-[1.2] p-0 whitespace-pre-wrap break-words flex-none text-black !font-inter text-[0.875em] !font-bold'>BUILDING NO 3427, STREET NO 300
                                      AL YASMEEN DIST,P.O.BOX 13325,</p>
                                  </div>
                                </div>
                              </div>

                            </div>
                          </div>
                          {/* pages component right side  */}
                          <div className='box-border relative flex flex-col flex-auto w-full min-w-0 min-h-0 flex-1'>
                            <div className='box-border relative flex flex-col flex-[1_1_0%]'>
                              <div className='box-border relative flex flex-col flex-shrink flex-grow-0 w-full min-w-0 min-h-0 flex-1'>
                                <div className="absolute pointer-events-none border border-[#d5dae4] z-[1] inset-[-1px_0_0_-1px]"></div>
                                <div className='box-border relative flex flex-1 flex-col'>
                                  <div className="whitespace-break-spaces box-border text-[0.75em] font-medium m-[0.5em] text-right text-[rgba(3,27,78,0.75)] !font-inter">Pages</div>
                                  <p className='m-0 outline-none border-0 leading-[1.2] p-0 whitespace-pre-wrap break-words text-right flex-none text-black !font-inter text-[0.875em] !font-bold'>1 of 1</p>
                                </div>
                                <div className='box-border relative flex flex-col flex-[0_1_auto] w-full min-w-0 min-h-0 flex-1'>
                                  <div className='box-border relative flex flex-col flex-[1_1_auto]'>
                                    {/* Quote No. and Date */}
                                    <div className='box-border relative flex flex-col flex-[0_1_auto] w-full min-w-0 min-h-0 flex-1'>
                                      <div className='box-border relative flex flex-col flex-[0_1_auto] h-full'>
                                        <div className='box-border relative flex flex-row flex-[0_1_auto] h-full w-full'>
                                          <div className='box-border relative flex flex-col flex-[0_1_auto] w-full min-w-0 min-h-0 '>
                                            <div className="absolute pointer-events-none border border-[#d5dae4] z-[1] inset-[-1px_0_0_-1px]"></div>
                                            <div className='flex flex-row justify-between items-center relative min-h-[2em] pt-[0.5em] cursor-pointer transition ease-in-out duration-[10ms] hover:bg-[#031b4e05]'>
                                              <div className='whitespace-break-spaces box-border text-[0.75em] font-medium m-[0.5em] w-full text-[rgba(3,27,78,0.75)] !font-inter'>Invoice Number</div>
                                            </div>
                                            <div className="flex flex-row max-w-[26.75em] p-[0.5em]">
                                              <Input placeholder='INV0001' className='w-full m-0 text-[0.75em] font-medium  w-full text-[rgba(3,27,78,0.75)] !font-inter py-[0.75em] h-fit px-[1em] bg-[#031b4e0a]' />
                                            </div>
                                          </div>
                                          <div className='box-border relative flex flex-col flex-[0_1_auto] w-full min-w-0 min-h-0 '>
                                            <div className="absolute pointer-events-none border border-[#d5dae4] z-[1] inset-[-1px_0_0_-1px]"></div>
                                            <div className='flex flex-row justify-between items-center relative min-h-[2em] pt-[0.5em] cursor-pointer transition ease-in-out duration-[10ms] hover:bg-[#031b4e05]'>
                                              <div className='whitespace-break-spaces box-border text-[0.75em] font-medium m-[0.5em] w-full text-[rgba(3,27,78,0.75)] !font-inter'>Date</div>
                                            </div>
                                            <div className="flex flex-row max-w-[26.75em] p-[0.5em]">
                                              <Input placeholder='INV0001' className='w-full m-0 border-0 text-[0.75em] font-medium  w-full text-[rgba(3,27,78,0.75)] !font-inter py-[0.75em] h-fit px-[1em] bg-[#031b4e0a]' />
                                            </div>
                                          </div>
                                        </div>

                                      </div>

                                    </div>
                                    {/* Buyer Reference and Expiry Date */}
                                    <div className='box-border relative flex flex-col flex-[0_1_auto] w-full min-w-0 min-h-0 flex-1'>
                                      <div className='box-border relative flex flex-col flex-[0_1_auto] h-full'>
                                        <div className='box-border relative flex flex-row flex-[0_1_auto] h-full w-full'>
                                          <div className='box-border relative flex flex-col flex-[0_1_auto] w-full min-w-0 min-h-0 '>
                                            <div className="absolute pointer-events-none border border-[#d5dae4] z-[1] inset-[-1px_0_0_-1px]"></div>
                                            <div className='flex flex-row justify-between items-center relative min-h-[2em] pt-[0.5em] cursor-pointer transition ease-in-out duration-[10ms] hover:bg-[#031b4e05]'>
                                              <div className='whitespace-break-spaces box-border text-[0.75em] font-medium m-[0.5em] w-full text-[rgba(3,27,78,0.75)] !font-inter'>Buyer Reference</div>
                                            </div>
                                            <div className="flex flex-row max-w-[26.75em] p-[0.5em]">
                                              <Input placeholder='INV0001' className='w-full m-0 text-[0.75em] font-medium  w-full text-[rgba(3,27,78,0.75)] !font-inter py-[0.75em] h-fit px-[1em] bg-[#031b4e0a]' />
                                            </div>
                                          </div>
                                          <div className='box-border relative flex flex-col flex-[0_1_auto] w-full min-w-0 min-h-0 '>
                                            <div className="absolute pointer-events-none border border-[#d5dae4] z-[1] inset-[-1px_0_0_-1px]"></div>
                                            <div className='flex flex-row justify-between items-center relative min-h-[2em] pt-[0.5em] cursor-pointer transition ease-in-out duration-[10ms] hover:bg-[#031b4e05]'>
                                              <div className='whitespace-break-spaces box-border text-[0.75em] font-medium m-[0.5em] w-full text-[rgba(3,27,78,0.75)] !font-inter'>Expiry Date</div>
                                            </div>
                                            <div className="flex flex-row max-w-[26.75em] p-[0.5em]">
                                              <Input placeholder='INV0001' className='w-full m-0 border-0 text-[0.75em] font-medium  w-full text-[rgba(3,27,78,0.75)] !font-inter py-[0.75em] h-fit px-[1em] bg-[#031b4e0a]' />
                                            </div>
                                          </div>
                                        </div>

                                      </div>

                                    </div>
                                    <div>

                                    </div>
                                    <div>

                                    </div>

                                  </div>

                                </div>
                              </div>
                            </div>
                            <div className='box-border relative flex flex-col flex-[0_1_auto] w-full min-w-0 min-h-0 flex-1'>

                            </div>

                          </div>
                        </div>
                      </div>
                      <div className='box-border relative flex flex-col flex-1 flex-[1_1_auto] h-full'>
                        <div className='box-border relative flex flex-row flex-1 h-full'>
                          {/* Buyer component left side */}
                          <div className='box-border relative flex flex-col flex-auto w-full min-w-0 min-h-0 flex-1'>
                            <div className="absolute pointer-events-none border border-[#d5dae4] z-[1] inset-[-1px_0_0_-1px]"></div>
                            <div className='relative box-border'>
                              <div className='flex flex-row justify-between items-center relative min-h-[2em] pt-[0.5em] cursor-pointer transition ease-in-out duration-[10ms] hover:bg-[#031b4e05]'>
                                <div className='whitespace-break-spaces box-border text-[0.75em] font-medium m-[0.5em] w-full text-[rgba(3,27,78,0.75)] !font-inter'>Buyer</div>
                              </div>
                              <div className='flex flex-col gap-[0.5em] flex-auto p-[0.5em] min-h-0'>
                                <div className="flex flex-row max-w-[26.75em]">
                                  <Input placeholder='Name' className='w-full m-0 text-[0.75em] font-medium  w-full text-[rgba(3,27,78,0.75)] !font-inter py-[0.75em] h-fit px-[1em] bg-[#031b4e0a]' />
                                </div>
                                <div className="box-border relative flex flex-row">
                                  <div className='box-border relative flex flex-1 min-h-[8em]'>
                                    <p className='m-0 outline-none border-0 leading-[1.2] p-0 whitespace-pre-wrap break-words flex-none text-black !font-inter text-[0.875em] !font-bold'>BUILDING NO 3427, STREET NO 300
                                      AL YASMEEN DIST,P.O.BOX 13325,</p>
                                  </div>
                                </div>
                              </div>

                            </div>
                          </div>
                          {/* pages component right side  */}
                          <div className='box-border relative flex flex-col flex-auto w-full min-w-0 min-h-0 flex-1'>
                            <div className='box-border relative flex flex-col flex-[1_1_0%]'>
                              <div className='box-border relative flex flex-col flex-shrink flex-grow-0 w-full min-w-0 min-h-0 flex-1'>
                                <div className="absolute pointer-events-none border border-[#d5dae4] z-[1] inset-[-1px_0_0_-1px]"></div>


                              </div>
                            </div>
                            <div className='box-border relative flex flex-col flex-[0_1_auto] w-full min-w-0 min-h-0 flex-1'>

                            </div>

                          </div>
                        </div>
                      </div>
                      <div className='box-border relative flex flex-col flex-1 flex-[1_1_auto] h-full'>
                        <div className='box-border relative flex flex-row flex-1 h-full'>
                          {/* Buyer component left side */}
                          <div className='box-border relative flex flex-col flex-auto w-full min-w-0 min-h-0 flex-1'>
                  
                            <div className='box-border relative flex flex-col flex-[0_1_auto] w-full min-w-0 min-h-0 flex-1'>
                            <div className='box-border relative flex flex-col flex-[0_1_auto] w-full min-w-0 min-h-0 flex-1'>
                                  <div className='box-border relative flex flex-col flex-[1_1_auto]'>
                                    {/* Quote No. and Date */}
                                    <div className='box-border relative flex flex-col flex-[0_1_auto] w-full min-w-0 min-h-0 flex-1'>
                                      <div className='box-border relative flex flex-col flex-[0_1_auto] h-full'>
                                        <div className='box-border relative flex flex-row flex-[0_1_auto] h-full w-full'>
                                          <div className='box-border relative flex flex-col flex-[0_1_auto] w-full min-w-0 min-h-0 '>
                                            <div className="absolute pointer-events-none border border-[#d5dae4] z-[1] inset-[-1px_0_0_-1px]"></div>
                                            <div className='flex flex-row justify-between items-center relative min-h-[2em] pt-[0.5em] cursor-pointer transition ease-in-out duration-[10ms] hover:bg-[#031b4e05]'>
                                              <div className='whitespace-break-spaces box-border text-[0.75em] font-medium m-[0.5em] w-full text-[rgba(3,27,78,0.75)] !font-inter'>Invoice Number</div>
                                            </div>
                                            <div className="flex flex-row max-w-[26.75em] p-[0.5em]">
                                              <Input placeholder='INV0001' className='w-full m-0 text-[0.75em] font-medium  w-full text-[rgba(3,27,78,0.75)] !font-inter py-[0.75em] h-fit px-[1em] bg-[#031b4e0a]' />
                                            </div>
                                          </div>
                                          <div className='box-border relative flex flex-col flex-[0_1_auto] w-full min-w-0 min-h-0 '>
                                            <div className="absolute pointer-events-none border border-[#d5dae4] z-[1] inset-[-1px_0_0_-1px]"></div>
                                            <div className='flex flex-row justify-between items-center relative min-h-[2em] pt-[0.5em] cursor-pointer transition ease-in-out duration-[10ms] hover:bg-[#031b4e05]'>
                                              <div className='whitespace-break-spaces box-border text-[0.75em] font-medium m-[0.5em] w-full text-[rgba(3,27,78,0.75)] !font-inter'>Date</div>
                                            </div>
                                            <div className="flex flex-row max-w-[26.75em] p-[0.5em]">
                                              <Input placeholder='INV0001' className='w-full m-0 border-0 text-[0.75em] font-medium  w-full text-[rgba(3,27,78,0.75)] !font-inter py-[0.75em] h-fit px-[1em] bg-[#031b4e0a]' />
                                            </div>
                                          </div>
                                        </div>

                                      </div>

                                    </div>
                                    {/* Buyer Reference and Expiry Date */}
                                    <div className='box-border relative flex flex-col flex-[0_1_auto] w-full min-w-0 min-h-0 flex-1'>
                                      <div className='box-border relative flex flex-col flex-[0_1_auto] h-full'>
                                        <div className='box-border relative flex flex-row flex-[0_1_auto] h-full w-full'>
                                          <div className='box-border relative flex flex-col flex-[0_1_auto] w-full min-w-0 min-h-0 '>
                                            <div className="absolute pointer-events-none border border-[#d5dae4] z-[1] inset-[-1px_0_0_-1px]"></div>
                                            <div className='flex flex-row justify-between items-center relative min-h-[2em] pt-[0.5em] cursor-pointer transition ease-in-out duration-[10ms] hover:bg-[#031b4e05]'>
                                              <div className='whitespace-break-spaces box-border text-[0.75em] font-medium m-[0.5em] w-full text-[rgba(3,27,78,0.75)] !font-inter'>Buyer Reference</div>
                                            </div>
                                            <div className="flex flex-row max-w-[26.75em] p-[0.5em]">
                                              <Input placeholder='INV0001' className='w-full m-0 text-[0.75em] font-medium  w-full text-[rgba(3,27,78,0.75)] !font-inter py-[0.75em] h-fit px-[1em] bg-[#031b4e0a]' />
                                            </div>
                                          </div>
                                          <div className='box-border relative flex flex-col flex-[0_1_auto] w-full min-w-0 min-h-0 '>
                                            <div className="absolute pointer-events-none border border-[#d5dae4] z-[1] inset-[-1px_0_0_-1px]"></div>
                                            <div className='flex flex-row justify-between items-center relative min-h-[2em] pt-[0.5em] cursor-pointer transition ease-in-out duration-[10ms] hover:bg-[#031b4e05]'>
                                              <div className='whitespace-break-spaces box-border text-[0.75em] font-medium m-[0.5em] w-full text-[rgba(3,27,78,0.75)] !font-inter'>Expiry Date</div>
                                            </div>
                                            <div className="flex flex-row max-w-[26.75em] p-[0.5em]">
                                              <Input placeholder='INV0001' className='w-full m-0 border-0 text-[0.75em] font-medium  w-full text-[rgba(3,27,78,0.75)] !font-inter py-[0.75em] h-fit px-[1em] bg-[#031b4e0a]' />
                                            </div>
                                          </div>
                                        </div>

                                      </div>

                                    </div>
                                    <div>

                                    </div>
                                    <div>

                                    </div>

                                  </div>

                                </div>
                            </div>

                          </div>
                              {/* pages component right side  */}
                          <div className='box-border relative flex flex-col flex-auto w-full min-w-0 min-h-0 flex-1'>
                            <div className="absolute pointer-events-none border border-[#d5dae4] z-[1] inset-[-1px_0_0_-1px]"></div>
                            <div className='relative box-border'>
                              <div className='flex flex-row justify-between items-center relative min-h-[2em] pt-[0.5em] cursor-pointer transition ease-in-out duration-[10ms] hover:bg-[#031b4e05]'>
                                <div className='whitespace-break-spaces box-border text-[0.75em] font-medium m-[0.5em] w-full text-[rgba(3,27,78,0.75)] !font-inter'>Buyer</div>
                              </div>
                              <div className='flex flex-col gap-[0.5em] flex-auto p-[0.5em] min-h-0'>
                                <div className="flex flex-row max-w-[26.75em]">
                                  <Input placeholder='Name' className='w-full m-0 text-[0.75em] font-medium  w-full text-[rgba(3,27,78,0.75)] !font-inter py-[0.75em] h-fit px-[1em] bg-[#031b4e0a]' />
                                </div>
                                <div className="box-border relative flex flex-row">
                                  <div className='box-border relative flex flex-1 min-h-[8em]'>
                                    <p className='m-0 outline-none border-0 leading-[1.2] p-0 whitespace-pre-wrap break-words flex-none text-black !font-inter text-[0.875em] !font-bold'>BUILDING NO 3427, STREET NO 300
                                      AL YASMEEN DIST,P.O.BOX 13325,</p>
                                  </div>
                                </div>
                              </div>

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='"box-border relative flex flex-col flex-[0_1_0] w-full min-w-0 min-h-0"'>
                    <div className='box-border relative flex flex-col flex-auto w-full min-w-0 min-h-0 flex-1'>
                      <div className='box-border relative flex flex-col flex-1 h-full'>
                        <div className='box-border relative flex flex-row flex-1 h-full'>
                          {/* seller component left side */}
                          <div className='box-border relative flex flex-col flex-auto w-full min-w-0 min-h-0 flex-1'>
                            <div className="absolute pointer-events-none border border-[#d5dae4] z-[1] inset-[-1px_0_0_-1px]"></div>
                            <div className='relative box-border'>
                              <div className='flex flex-row justify-between items-center relative min-h-[2em] pt-[0.5em] cursor-pointer transition ease-in-out duration-[10ms] hover:bg-[#031b4e05]'>
                                <div className='whitespace-break-spaces box-border text-[0.75em] font-medium m-[0.5em] w-full text-[rgba(3,27,78,0.75)] !font-inter'>Seller</div>
                              </div>
                              <div className='flex flex-col gap-[0.5em] flex-auto p-[0.5em] min-h-0'>
                                <div className="flex flex-row max-w-[26.75em]">
                                  <Input placeholder='Name' className='w-full m-0 text-[0.75em] font-medium  w-full text-[rgba(3,27,78,0.75)] !font-inter py-[0.75em] h-fit px-[1em] bg-[#031b4e0a]' />
                                </div>
                                <div className="box-border relative flex flex-row">
                                  <div className='box-border relative flex flex-1 min-h-[8em]'>
                                    <p className='m-0 outline-none border-0 leading-[1.2] p-0 whitespace-pre-wrap break-words flex-none text-black !font-inter text-[0.875em] !font-bold'>BUILDING NO 3427, STREET NO 300
                                      AL YASMEEN DIST,P.O.BOX 13325,</p>
                                  </div>
                                </div>
                              </div>

                            </div>
                          </div>
                          {/* pages component right side  */}
                          <div className='box-border relative flex flex-col flex-auto w-full min-w-0 min-h-0 flex-1'>
                            <div className='box-border relative flex flex-col flex-[1_1_0%]'>
                              <div className='box-border relative flex flex-col flex-shrink flex-grow-0 w-full min-w-0 min-h-0 flex-1'>
                                <div className="absolute pointer-events-none border border-[#d5dae4] z-[1] inset-[-1px_0_0_-1px]"></div>
                                <div className='box-border relative flex flex-1 flex-col'>
                                  <div className="whitespace-break-spaces box-border text-[0.75em] font-medium m-[0.5em] text-right text-[rgba(3,27,78,0.75)] !font-inter">Pages</div>
                                  <p className='m-0 outline-none border-0 leading-[1.2] p-0 whitespace-pre-wrap break-words text-right flex-none text-black !font-inter text-[0.875em] !font-bold'>1 of 1</p>
                                </div>
                                <div className='box-border relative flex flex-col flex-[0_1_auto] w-full min-w-0 min-h-0 flex-1'>
                                  <div className='box-border relative flex flex-col flex-[1_1_auto]'>
                                    {/* Quote No. and Date */}
                                    <div className='box-border relative flex flex-col flex-[0_1_auto] w-full min-w-0 min-h-0 flex-1'>
                                      <div className='box-border relative flex flex-col flex-[0_1_auto] h-full'>
                                        <div className='box-border relative flex flex-row flex-[0_1_auto] h-full w-full'>
                                          <div className='box-border relative flex flex-col flex-[0_1_auto] w-full min-w-0 min-h-0 '>
                                            <div className="absolute pointer-events-none border border-[#d5dae4] z-[1] inset-[-1px_0_0_-1px]"></div>
                                            <div className='flex flex-row justify-between items-center relative min-h-[2em] pt-[0.5em] cursor-pointer transition ease-in-out duration-[10ms] hover:bg-[#031b4e05]'>
                                              <div className='whitespace-break-spaces box-border text-[0.75em] font-medium m-[0.5em] w-full text-[rgba(3,27,78,0.75)] !font-inter'>Invoice Number</div>
                                            </div>
                                            <div className="flex flex-row max-w-[26.75em] p-[0.5em]">
                                              <Input placeholder='INV0001' className='w-full m-0 text-[0.75em] font-medium  w-full text-[rgba(3,27,78,0.75)] !font-inter py-[0.75em] h-fit px-[1em] bg-[#031b4e0a]' />
                                            </div>
                                          </div>
                                          <div className='box-border relative flex flex-col flex-[0_1_auto] w-full min-w-0 min-h-0 '>
                                            <div className="absolute pointer-events-none border border-[#d5dae4] z-[1] inset-[-1px_0_0_-1px]"></div>
                                            <div className='flex flex-row justify-between items-center relative min-h-[2em] pt-[0.5em] cursor-pointer transition ease-in-out duration-[10ms] hover:bg-[#031b4e05]'>
                                              <div className='whitespace-break-spaces box-border text-[0.75em] font-medium m-[0.5em] w-full text-[rgba(3,27,78,0.75)] !font-inter'>Date</div>
                                            </div>
                                            <div className="flex flex-row max-w-[26.75em] p-[0.5em]">
                                              <Input placeholder='INV0001' className='w-full m-0 border-0 text-[0.75em] font-medium  w-full text-[rgba(3,27,78,0.75)] !font-inter py-[0.75em] h-fit px-[1em] bg-[#031b4e0a]' />
                                            </div>
                                          </div>
                                        </div>

                                      </div>

                                    </div>
                                    {/* Buyer Reference and Expiry Date */}
                                    <div className='box-border relative flex flex-col flex-[0_1_auto] w-full min-w-0 min-h-0 flex-1'>
                                      <div className='box-border relative flex flex-col flex-[0_1_auto] h-full'>
                                        <div className='box-border relative flex flex-row flex-[0_1_auto] h-full w-full'>
                                          <div className='box-border relative flex flex-col flex-[0_1_auto] w-full min-w-0 min-h-0 '>
                                            <div className="absolute pointer-events-none border border-[#d5dae4] z-[1] inset-[-1px_0_0_-1px]"></div>
                                            <div className='flex flex-row justify-between items-center relative min-h-[2em] pt-[0.5em] cursor-pointer transition ease-in-out duration-[10ms] hover:bg-[#031b4e05]'>
                                              <div className='whitespace-break-spaces box-border text-[0.75em] font-medium m-[0.5em] w-full text-[rgba(3,27,78,0.75)] !font-inter'>Buyer Reference</div>
                                            </div>
                                            <div className="flex flex-row max-w-[26.75em] p-[0.5em]">
                                              <Input placeholder='INV0001' className='w-full m-0 text-[0.75em] font-medium  w-full text-[rgba(3,27,78,0.75)] !font-inter py-[0.75em] h-fit px-[1em] bg-[#031b4e0a]' />
                                            </div>
                                          </div>
                                          <div className='box-border relative flex flex-col flex-[0_1_auto] w-full min-w-0 min-h-0 '>
                                            <div className="absolute pointer-events-none border border-[#d5dae4] z-[1] inset-[-1px_0_0_-1px]"></div>
                                            <div className='flex flex-row justify-between items-center relative min-h-[2em] pt-[0.5em] cursor-pointer transition ease-in-out duration-[10ms] hover:bg-[#031b4e05]'>
                                              <div className='whitespace-break-spaces box-border text-[0.75em] font-medium m-[0.5em] w-full text-[rgba(3,27,78,0.75)] !font-inter'>Expiry Date</div>
                                            </div>
                                            <div className="flex flex-row max-w-[26.75em] p-[0.5em]">
                                              <Input placeholder='INV0001' className='w-full m-0 border-0 text-[0.75em] font-medium  w-full text-[rgba(3,27,78,0.75)] !font-inter py-[0.75em] h-fit px-[1em] bg-[#031b4e0a]' />
                                            </div>
                                          </div>
                                        </div>

                                      </div>

                                    </div>
                                    <div>

                                    </div>
                                    <div>

                                    </div>

                                  </div>

                                </div>
                              </div>
                            </div>
                            <div className='box-border relative flex flex-col flex-[0_1_auto] w-full min-w-0 min-h-0 flex-1'>

                            </div>

                          </div>
                        </div>
                      </div>
                      <div className='box-border relative flex flex-col flex-1 h-full'>
                        <div className='box-border relative flex flex-row flex-1 h-full'>
                          {/* Buyer component left side */}
                          <div className='box-border relative flex flex-col flex-auto w-full min-w-0 min-h-0 flex-1'>
                            <div className="absolute pointer-events-none border border-[#d5dae4] z-[1] inset-[-1px_0_0_-1px]"></div>
                            <div className='relative box-border'>
                              <div className='flex flex-row justify-between items-center relative min-h-[2em] pt-[0.5em] cursor-pointer transition ease-in-out duration-[10ms] hover:bg-[#031b4e05]'>
                                <div className='whitespace-break-spaces box-border text-[0.75em] font-medium m-[0.5em] w-full text-[rgba(3,27,78,0.75)] !font-inter'>Buyer</div>
                              </div>
                              <div className='flex flex-col gap-[0.5em] flex-auto p-[0.5em] min-h-0'>
                                <div className="flex flex-row max-w-[26.75em]">
                                  <Input placeholder='Name' className='w-full m-0 text-[0.75em] font-medium  w-full text-[rgba(3,27,78,0.75)] !font-inter py-[0.75em] h-fit px-[1em] bg-[#031b4e0a]' />
                                </div>
                                <div className="box-border relative flex flex-row">
                                  <div className='box-border relative flex flex-1 min-h-[8em]'>
                                    <p className='m-0 outline-none border-0 leading-[1.2] p-0 whitespace-pre-wrap break-words flex-none text-black !font-inter text-[0.875em] !font-bold'>BUILDING NO 3427, STREET NO 300
                                      AL YASMEEN DIST,P.O.BOX 13325,</p>
                                  </div>
                                </div>
                              </div>

                            </div>
                          </div>
                          {/* pages component right side  */}
                          <div className='box-border relative flex flex-col flex-auto w-full min-w-0 min-h-0 flex-1'>
                            <div className='box-border relative flex flex-col flex-[1_1_0%]'>
                              <div className='box-border relative flex flex-col flex-shrink flex-grow-0 w-full min-w-0 min-h-0 flex-1'>
                                <div className="absolute pointer-events-none border border-[#d5dae4] z-[1] inset-[-1px_0_0_-1px]"></div>


                              </div>
                            </div>
                            <div className='box-border relative flex flex-col flex-[0_1_auto] w-full min-w-0 min-h-0 flex-1'>

                            </div>

                          </div>
                        </div>
                      </div>
                      <div className='box-border relative flex flex-col flex-1 h-full'>
                        <div className='box-border relative flex flex-row flex-1 h-full'>
                          {/* Buyer component left side */}
                          <div className='box-border relative flex flex-col flex-auto w-full min-w-0 min-h-0 flex-1'>
                            <div className='box-border relative flex flex-col flex-[1_1_0%]'>
                              <div className='box-border relative flex flex-col flex-shrink flex-grow-0 w-full min-w-0 min-h-0 flex-1'>
                                <div className="absolute pointer-events-none border border-[#d5dae4] z-[1] inset-[-1px_0_0_-1px]"></div>


                              </div>
                            </div>
                            <div className='box-border relative flex flex-col flex-[0_1_auto] w-full min-w-0 min-h-0 flex-1'>
                            <div className='box-border relative flex flex-col flex-[0_1_auto] w-full min-w-0 min-h-0 flex-1'>
                                  <div className='box-border relative flex flex-col flex-[1_1_auto]'>
                                    {/* Quote No. and Date */}
                                    <div className='box-border relative flex flex-col flex-[0_1_auto] w-full min-w-0 min-h-0 flex-1'>
                                      <div className='box-border relative flex flex-col flex-[0_1_auto] h-full'>
                                        <div className='box-border relative flex flex-row flex-[0_1_auto] h-full w-full'>
                                          <div className='box-border relative flex flex-col flex-[0_1_auto] w-full min-w-0 min-h-0 '>
                                            <div className="absolute pointer-events-none border border-[#d5dae4] z-[1] inset-[-1px_0_0_-1px]"></div>
                                            <div className='flex flex-row justify-between items-center relative min-h-[2em] pt-[0.5em] cursor-pointer transition ease-in-out duration-[10ms] hover:bg-[#031b4e05]'>
                                              <div className='whitespace-break-spaces box-border text-[0.75em] font-medium m-[0.5em] w-full text-[rgba(3,27,78,0.75)] !font-inter'>Invoice Number</div>
                                            </div>
                                            <div className="flex flex-row max-w-[26.75em] p-[0.5em]">
                                              <Input placeholder='INV0001' className='w-full m-0 text-[0.75em] font-medium  w-full text-[rgba(3,27,78,0.75)] !font-inter py-[0.75em] h-fit px-[1em] bg-[#031b4e0a]' />
                                            </div>
                                          </div>
                                          <div className='box-border relative flex flex-col flex-[0_1_auto] w-full min-w-0 min-h-0 '>
                                            <div className="absolute pointer-events-none border border-[#d5dae4] z-[1] inset-[-1px_0_0_-1px]"></div>
                                            <div className='flex flex-row justify-between items-center relative min-h-[2em] pt-[0.5em] cursor-pointer transition ease-in-out duration-[10ms] hover:bg-[#031b4e05]'>
                                              <div className='whitespace-break-spaces box-border text-[0.75em] font-medium m-[0.5em] w-full text-[rgba(3,27,78,0.75)] !font-inter'>Date</div>
                                            </div>
                                            <div className="flex flex-row max-w-[26.75em] p-[0.5em]">
                                              <Input placeholder='INV0001' className='w-full m-0 border-0 text-[0.75em] font-medium  w-full text-[rgba(3,27,78,0.75)] !font-inter py-[0.75em] h-fit px-[1em] bg-[#031b4e0a]' />
                                            </div>
                                          </div>
                                        </div>

                                      </div>

                                    </div>
                                    {/* Buyer Reference and Expiry Date */}
                                    <div className='box-border relative flex flex-col flex-[0_1_auto] w-full min-w-0 min-h-0 flex-1'>
                                      <div className='box-border relative flex flex-col flex-[0_1_auto] h-full'>
                                        <div className='box-border relative flex flex-row flex-[0_1_auto] h-full w-full'>
                                          <div className='box-border relative flex flex-col flex-[0_1_auto] w-full min-w-0 min-h-0 '>
                                            <div className="absolute pointer-events-none border border-[#d5dae4] z-[1] inset-[-1px_0_0_-1px]"></div>
                                            <div className='flex flex-row justify-between items-center relative min-h-[2em] pt-[0.5em] cursor-pointer transition ease-in-out duration-[10ms] hover:bg-[#031b4e05]'>
                                              <div className='whitespace-break-spaces box-border text-[0.75em] font-medium m-[0.5em] w-full text-[rgba(3,27,78,0.75)] !font-inter'>Buyer Reference</div>
                                            </div>
                                            <div className="flex flex-row max-w-[26.75em] p-[0.5em]">
                                              <Input placeholder='INV0001' className='w-full m-0 text-[0.75em] font-medium  w-full text-[rgba(3,27,78,0.75)] !font-inter py-[0.75em] h-fit px-[1em] bg-[#031b4e0a]' />
                                            </div>
                                          </div>
                                          <div className='box-border relative flex flex-col flex-[0_1_auto] w-full min-w-0 min-h-0 '>
                                            <div className="absolute pointer-events-none border border-[#d5dae4] z-[1] inset-[-1px_0_0_-1px]"></div>
                                            <div className='flex flex-row justify-between items-center relative min-h-[2em] pt-[0.5em] cursor-pointer transition ease-in-out duration-[10ms] hover:bg-[#031b4e05]'>
                                              <div className='whitespace-break-spaces box-border text-[0.75em] font-medium m-[0.5em] w-full text-[rgba(3,27,78,0.75)] !font-inter'>Expiry Date</div>
                                            </div>
                                            <div className="flex flex-row max-w-[26.75em] p-[0.5em]">
                                              <Input placeholder='INV0001' className='w-full m-0 border-0 text-[0.75em] font-medium  w-full text-[rgba(3,27,78,0.75)] !font-inter py-[0.75em] h-fit px-[1em] bg-[#031b4e0a]' />
                                            </div>
                                          </div>
                                        </div>

                                      </div>

                                    </div>
                                    <div>

                                    </div>
                                    <div>

                                    </div>

                                  </div>

                                </div>
                            </div>

                          </div>
                              {/* pages component right side  */}
                          <div className='box-border relative flex flex-col flex-auto w-full min-w-0 min-h-0 flex-1'>
                            <div className="absolute pointer-events-none border border-[#d5dae4] z-[1] inset-[-1px_0_0_-1px]"></div>
                            <div className='relative box-border'>
                              <div className='flex flex-row justify-between items-center relative min-h-[2em] pt-[0.5em] cursor-pointer transition ease-in-out duration-[10ms] hover:bg-[#031b4e05]'>
                                <div className='whitespace-break-spaces box-border text-[0.75em] font-medium m-[0.5em] w-full text-[rgba(3,27,78,0.75)] !font-inter'>Buyer</div>
                              </div>
                              <div className='flex flex-col gap-[0.5em] flex-auto p-[0.5em] min-h-0'>
                                <div className="flex flex-row max-w-[26.75em]">
                                  <Input placeholder='Name' className='w-full m-0 text-[0.75em] font-medium  w-full text-[rgba(3,27,78,0.75)] !font-inter py-[0.75em] h-fit px-[1em] bg-[#031b4e0a]' />
                                </div>
                                <div className="box-border relative flex flex-row">
                                  <div className='box-border relative flex flex-1 min-h-[8em]'>
                                    <p className='m-0 outline-none border-0 leading-[1.2] p-0 whitespace-pre-wrap break-words flex-none text-black !font-inter text-[0.875em] !font-bold'>BUILDING NO 3427, STREET NO 300
                                      AL YASMEEN DIST,P.O.BOX 13325,</p>
                                  </div>
                                </div>
                              </div>

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>

  )
}

export default page